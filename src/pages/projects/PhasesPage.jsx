import { useCallback } from 'react'
import { useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { FormAlert } from '../../components/FormAlert.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { PhaseCard } from '../../components/phases/PhaseCard.jsx'
import { PlanPreview } from '../../components/phases/PlanPreview.jsx'
import { ProgressBar } from '../../components/phases/ProgressBar.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { generatePlan, getPlanPreview, getWorkPlan } from '../../services/phaseService.js'
import { getProject } from '../../services/projectService.js'
import { formatDate } from '../../utils/format.js'
import { isClosed } from '../../utils/projectStatus.js'
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
  const project = useApiData((signal) => getProject(id, { signal }), [id])
  const plan = useApiData((signal) => getWorkPlan(id, { signal }), [id])
  const { retry } = plan
  const reload = useCallback(() => retry(), [retry])

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

  return (
    <div className="workspace">
      <PageHeader title="Phases and tasks" description={project.data.name} back={back} />
      <section className="card">
        <h2>Progress of the project</h2>
        <ProgressBar value={plan.data.progressPct} label="Progress of the project" />
        <p className="muted">
          Average of the {phases.reduce((total, phase) => total + phase.tasks.length, 0)} tasks.
          {plan.data.plannedStartDate &&
            ` Planned from ${formatDate(plan.data.plannedStartDate)} to ${formatDate(plan.data.plannedEndDate)}.`}
        </p>
        {closed && <p className="muted">The project is closed: the plan can be read but not changed.</p>}
      </section>
      {phases.map((phase) => (
        <PhaseCard key={phase.id} projectId={id} phase={phase} />
      ))}
    </div>
  )
}
