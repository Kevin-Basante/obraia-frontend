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
import { t } from '../../i18n/i18n.js'

/** Shown while the project has no plan: the phases it would get and the button to create them. */
function NoPlan({ projectId, closed, onCreated }) {
  const preview = useApiData((signal) => getPlanPreview(projectId, { signal }), [projectId])
  const create = useCallback(() => generatePlan(projectId).then(onCreated), [projectId, onCreated])
  const creating = useFormSubmit(create)

  return (
    <section className="card">
      <h2>{t('phasesPage.noWorkPlanYet')}</h2>
      {preview.status === 'error' && <FormAlert>{preview.error.message}</FormAlert>}
      {!preview.data && preview.status === 'loading' && (
        <p className="muted">{t('phasesPage.loadingTheStandardPhases')}</p>
      )}
      {preview.data && <PlanPreview preview={preview.data} />}
      {closed ? (
        <p className="muted">{t('phasesPage.theProjectIsClosedSo')}</p>
      ) : (
        <div className="button-row">
          <button type="button" disabled={creating.pending || !preview.data} onClick={() => creating.submit()}>
            {creating.pending ? t('phasesPage.creating') : t('phasesPage.createPlan')}
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
        if (window.confirm(t('phasesPage.confirmDeleteTask', { name: task.name }))) {
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
  if (!project.data || !plan.data) return <LoadingState title={t('phasesPage.loadingTheWorkPlan')} />

  const closed = isClosed(project.data)
  const { phases } = plan.data
  const back = { to: `/projects/${id}`, label: project.data.name }

  if (phases.length === 0) {
    return (
      <div className="workspace">
        <PageHeader title={t('phasesPage.phasesAndTasks')} description={project.data.name} back={back} />
        <NoPlan projectId={id} closed={closed} onCreated={reload} />
      </div>
    )
  }

  const canDeletePlan = !closed && countReports(plan.data) === 0

  function handleDeletePlan() {
    if (window.confirm(t('phasesPage.deleteTheWholePlanIts'))) {
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
        title={t('phasesPage.phasesAndTasks')}
        description={project.data.name}
        back={back}
        actions={
          canDeletePlan && (
            <button type="button" className="button-secondary" disabled={working.pending} onClick={handleDeletePlan}>
              {t('phasesPage.deletePlan')}
            </button>
          )
        }
      />
      <section className="card">
        <h2>{t('phasesPage.progressOfTheProject')}</h2>
        <ProgressBar value={plan.data.progressPct} label={t('phasesPage.progressOfTheProject')} />
        <p className="muted">
          {t('phasesPage.average', { count: phases.reduce((total, phase) => total + phase.tasks.length, 0) })}
          {plan.data.plannedStartDate &&
            t('phasesPage.plannedRange', {
              start: formatDate(plan.data.plannedStartDate),
              end: formatDate(plan.data.plannedEndDate),
            })}
        </p>
        {closed && <p className="muted">{t('phasesPage.theProjectIsClosedThe')}</p>}
        <FormAlert>{working.error?.message}</FormAlert>
      </section>
      {!closed && (
        <section className="card">
          <h2>{editing ? t('phasesPage.editTask', { name: editing.name }) : t('phasesPage.addATask')}</h2>
          <WorkItemForm
            key={formKey}
            initialForm={editing ? toWorkForm(editing) : EMPTY_TASK_FORM}
            phases={phases}
            validate={validateTask}
            onSave={saveTask}
            onCancel={editing ? handleCancel : undefined}
            submitText={editing ? t('phasesPage.saveTask') : t('phasesPage.addTask')}
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
