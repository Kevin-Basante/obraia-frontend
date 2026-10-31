import { useCallback } from 'react'
import { useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { FormAlert } from '../../components/FormAlert.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { CostBreakdown } from '../../components/budgets/CostBreakdown.jsx'
import { StatusBadge } from '../../components/projects/StatusBadge.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { approveBudget, getBudget } from '../../services/budgetService.js'
import { getProject } from '../../services/projectService.js'
import { formatDateTime } from '../../utils/format.js'
import { isClosed } from '../../utils/projectStatus.js'
import { NotFoundPage } from '../NotFoundPage.jsx'

/** One saved version of the budget, with its rows and the button to approve it. */
export function BudgetDetailPage() {
  const { id, budgetId } = useParams()
  const project = useApiData((signal) => getProject(id, { signal }), [id])
  const budget = useApiData((signal) => getBudget(id, budgetId, { signal }), [id, budgetId])
  const { retry } = budget
  const approve = useCallback(() => approveBudget(id, budgetId).then(() => retry()), [id, budgetId, retry])
  const approving = useFormSubmit(approve)

  if (project.error?.status === 404 || budget.error?.status === 404) return <NotFoundPage />
  const failed = [project, budget].find((request) => request.status === 'error')
  if (failed) return <ErrorState error={failed.error} onRetry={failed.retry} />
  if (!project.data || !budget.data) return <LoadingState title="Loading the budget version…" />

  const { data } = budget
  const canApprove = data.status.code === 'draft' && !isClosed(project.data)

  function handleApprove() {
    if (window.confirm(`Approve version ${data.version}? The version approved before, if any, becomes superseded.`)) {
      approving.submit()
    }
  }

  return (
    <div className="workspace">
      <PageHeader
        title={`Budget version ${data.version}`}
        description={project.data.name}
        back={{ to: `/projects/${id}/budgets`, label: 'Budget' }}
        actions={
          canApprove && (
            <button type="button" disabled={approving.pending} onClick={handleApprove}>
              {approving.pending ? 'Approving…' : 'Approve'}
            </button>
          )
        }
      />
      <section className="card">
        <h2>
          Cost layers <StatusBadge status={data.status} />
        </h2>
        <p className="muted">
          Saved {formatDateTime(data.createdAt)}
          {data.approvedAt && ` · approved ${formatDateTime(data.approvedAt)}`}.
        </p>
        <FormAlert>{approving.error?.message}</FormAlert>
        <CostBreakdown items={data.items} total={data.projectedAmount} />
      </section>
    </div>
  )
}
