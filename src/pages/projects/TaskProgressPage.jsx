import { useCallback } from 'react'
import { useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { ProgressBar } from '../../components/phases/ProgressBar.jsx'
import { ProgressHistory } from '../../components/phases/ProgressHistory.jsx'
import { ProgressReportForm } from '../../components/phases/ProgressReportForm.jsx'
import { StatusBadge } from '../../components/projects/StatusBadge.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { getWorkPlan } from '../../services/phaseService.js'
import { getProject } from '../../services/projectService.js'
import { listProgressReports, reportProgress } from '../../services/taskService.js'
import { isClosed } from '../../utils/projectStatus.js'
import { findTask } from '../../utils/workStatus.js'
import { NotFoundPage } from '../NotFoundPage.jsx'

/** One task: its progress, the form to report more and the reports so far. */
export function TaskProgressPage() {
  const { id, taskId } = useParams()
  const project = useApiData((signal) => getProject(id, { signal }), [id])
  const plan = useApiData((signal) => getWorkPlan(id, { signal }), [id])
  const reports = useApiData((signal) => listProgressReports(id, taskId, { signal }), [id, taskId])
  const retryPlan = plan.retry
  const retryReports = reports.retry

  const save = useCallback(
    async (request) => {
      const saved = await reportProgress(id, taskId, request)
      // The report can start or complete the task and its phase.
      retryPlan()
      retryReports()
      return saved
    },
    [id, taskId, retryPlan, retryReports],
  )

  if (project.error?.status === 404 || reports.error?.status === 404) return <NotFoundPage />
  const failed = [project, plan, reports].find((request) => request.status === 'error')
  if (failed) return <ErrorState error={failed.error} onRetry={failed.retry} />
  if (!project.data || !plan.data || !reports.data) return <LoadingState title="Loading the task…" />

  const found = findTask(plan.data, taskId)
  if (!found) return <NotFoundPage />
  const { phase, task } = found
  const closed = isClosed(project.data)

  return (
    <div className="workspace">
      <PageHeader
        title={task.name}
        description={`${project.data.name} · Phase ${phase.order}: ${phase.name}`}
        back={{ to: `/projects/${id}/phases`, label: 'Phases and tasks' }}
      />
      <section className="card">
        <h2>
          Progress <StatusBadge status={task.status} />
        </h2>
        <ProgressBar value={task.progressPct} label={`Progress of ${task.name}`} />
        <p className="muted">
          The progress of a task is its latest report. More than 0% starts it and 100% completes it; the phase is
          completed when all its tasks are.
        </p>
      </section>
      {!closed && (
        <section className="card">
          <h2>Report progress</h2>
          <ProgressReportForm siteManager={project.data.siteManager} onSave={save} />
        </section>
      )}
      <section className="card">
        <h2>Reports</h2>
        <ProgressHistory reports={reports.data} />
      </section>
    </div>
  )
}
