import { useCallback, useMemo, useState } from 'react'
import { useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { FormAlert } from '../../components/FormAlert.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { PhaseCard } from '../../components/phases/PhaseCard.jsx'
import { PlanPreview } from '../../components/phases/PlanPreview.jsx'
import { ProgressBar } from '../../components/phases/ProgressBar.jsx'
import { WorkItemForm } from '../../components/phases/WorkItemForm.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import {
  changePhaseStatus,
  deletePlan,
  generatePlan,
  getPlanPreview,
  getWorkPlan,
  updatePhase,
} from '../../services/phaseService.js'
import { getProject } from '../../services/projectService.js'
import { changeTaskStatus, createTask, deleteTask, updateTask } from '../../services/taskService.js'
import { formatDate } from '../../utils/format.js'
import { isClosed } from '../../utils/projectStatus.js'
import { EMPTY_TASK_FORM, toTaskRequest, toWorkForm, validateTask } from '../../utils/workForm.js'
import { countReports } from '../../utils/workStatus.js'
import { NotFoundPage } from '../NotFoundPage.jsx'

/** Shown while the project has no plan: the phases it would get and the button to create them. */
function NoPlan({ projectId, closed, onCreated }) {
  const preview = useApiData((signal) => getPlanPreview(projectId, { signal }), [projectId])
  const create = useCallback(() => generatePlan(projectId).then(onCreated), [projectId, onCreated])
  const creating = useFormSubmit(create)

  return (
    <section className="card">
      <h2>No work plan yet</h2>
      {preview.status === 'error' && <FormAlert>{preview.error.message}</FormAlert>}
      {!preview.data && preview.status === 'loading' && <p className="muted">Loading the standard phases…</p>}
      {preview.data && <PlanPreview preview={preview.data} />}
      {closed ? (
        <p className="muted">The project is closed, so the plan can no longer be created.</p>
      ) : (
        <div className="button-row">
          <button type="button" disabled={creating.pending || !preview.data} onClick={() => creating.submit()}>
            {creating.pending ? 'Creating…' : 'Create plan'}
          </button>
        </div>
      )}
      <FormAlert>{creating.error?.message}</FormAlert>
    </section>
  )
}

/** Phases and tasks of a project, with their status and progress. */
export function PhasesPage() {
  const { id } = useParams()
  // The task being edited, or null to add a new one.
  const [editing, setEditing] = useState(null)
  // Changes after each save, so the task form starts empty again.
  const [formKey, setFormKey] = useState(0)

  const project = useApiData((signal) => getProject(id, { signal }), [id])
  const plan = useApiData((signal) => getWorkPlan(id, { signal }), [id])
  const { retry } = plan
  const reload = useCallback(() => retry(), [retry])

  const run = useCallback((action) => action().then(reload), [reload])
  const working = useFormSubmit(run)
  const { submit } = working

  const actions = useMemo(
    () => ({
      savePhase: (phase, request) => updatePhase(id, phase.id, request).then(reload),
      changePhaseStatus: (phase, code) => submit(() => changePhaseStatus(id, phase.id, code)),
      changeTaskStatus: (task, code) => submit(() => changeTaskStatus(id, task.id, code)),
      editTask: (task) => {
        setEditing(task)
        setFormKey((key) => key + 1)
      },
      deleteTask: (task) => {
        if (window.confirm(`Delete the task "${task.name}" and its progress reports?`)) {
          setEditing((current) => (current?.id === task.id ? null : current))
          submit(() => deleteTask(id, task.id))
        }
      },
    }),
    [id, reload, submit],
  )

  const saveTask = useCallback(
    async (form) => {
      const request = toTaskRequest(form)
      const saved = editing ? await updateTask(id, editing.id, request) : await createTask(id, request)
      setEditing(null)
      setFormKey((key) => key + 1)
      reload()
      return saved
    },
    [id, editing, reload],
  )

  if (project.error?.status === 404) return <NotFoundPage />
  const failed = [project, plan].find((request) => request.status === 'error')
  if (failed) return <ErrorState error={failed.error} onRetry={failed.retry} />
  if (!project.data || !plan.data) return <LoadingState title="Loading the work plan…" />

  const closed = isClosed(project.data)
  const { phases } = plan.data
  const back = { to: `/projects/${id}`, label: project.data.name }

  if (phases.length === 0) {
    return (
      <div className="workspace">
        <PageHeader title="Phases and tasks" description={project.data.name} back={back} />
        <NoPlan projectId={id} closed={closed} onCreated={reload} />
      </div>
    )
  }

  const canDeletePlan = !closed && countReports(plan.data) === 0

  function handleDeletePlan() {
    if (window.confirm('Delete the whole plan? Its phases and tasks are removed so it can be created again.')) {
      submit(() => deletePlan(id))
    }
  }

  function handleCancel() {
    setEditing(null)
    setFormKey((key) => key + 1)
  }

  return (
    <div className="workspace">
      <PageHeader
        title="Phases and tasks"
        description={project.data.name}
        back={back}
        actions={
          canDeletePlan && (
            <button type="button" className="button-secondary" disabled={working.pending} onClick={handleDeletePlan}>
              Delete plan
            </button>
          )
        }
      />
      <section className="card">
        <h2>Progress of the project</h2>
        <ProgressBar value={plan.data.progressPct} label="Progress of the project" />
        <p className="muted">
          Average of the {phases.reduce((total, phase) => total + phase.tasks.length, 0)} tasks.
          {plan.data.plannedStartDate &&
            ` Planned from ${formatDate(plan.data.plannedStartDate)} to ${formatDate(plan.data.plannedEndDate)}.`}
        </p>
        {closed && <p className="muted">The project is closed: the plan can be read but not changed.</p>}
        <FormAlert>{working.error?.message}</FormAlert>
      </section>
      {!closed && (
        <section className="card">
          <h2>{editing ? `Edit task "${editing.name}"` : 'Add a task'}</h2>
          <WorkItemForm
            key={formKey}
            initialForm={editing ? toWorkForm(editing) : EMPTY_TASK_FORM}
            phases={phases}
            validate={validateTask}
            onSave={saveTask}
            onCancel={editing ? handleCancel : undefined}
            submitText={editing ? 'Save task' : 'Add task'}
          />
        </section>
      )}
      {phases.map((phase) => (
        <PhaseCard
          key={phase.id}
          projectId={id}
          phase={phase}
          actions={closed ? undefined : actions}
          busy={working.pending}
        />
      ))}
    </div>
  )
}
