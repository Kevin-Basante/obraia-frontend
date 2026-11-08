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
import { t } from '../../i18n/i18n.js'

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
  if (!project.data || !budget.data) return <LoadingState title={t('budgetDetailPage.loadingTheBudgetVersion')} />

  const { data } = budget
  const canApprove = data.status.code === 'draft' && !isClosed(project.data)

  function handleApprove() {
    if (window.confirm(t('budgetDetailPage.confirmApprove', { version: data.version }))) {
      approving.submit()
    }
  }

  return (
    <div className="workspace">
      <PageHeader
        title={t('budgetDetailPage.title', { version: data.version })}
        description={project.data.name}
        back={{ to: `/projects/${id}/budgets`, label: t('budgetDetailPage.budget') }}
        actions={
          canApprove && (
            <button type="button" disabled={approving.pending} onClick={handleApprove}>
              {approving.pending ? t('budgetDetailPage.approving') : t('budgetDetailPage.approve')}
            </button>
          )
        }
      />
      <section className="card">
        <h2>
          {t('budgetDetailPage.costLayers')} <StatusBadge status={data.status} />
        </h2>
        <p className="muted">
          {t('budgetDetailPage.savedAt', { date: formatDateTime(data.createdAt) })}
          {data.approvedAt && t('budgetDetailPage.approvedAt', { date: formatDateTime(data.approvedAt) })}
        </p>
        <FormAlert>{approving.error?.message}</FormAlert>
        <CostBreakdown items={data.items} total={data.projectedAmount} />
      </section>
    </div>
  )
}
