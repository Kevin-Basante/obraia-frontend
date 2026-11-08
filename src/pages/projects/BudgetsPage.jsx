import { useCallback } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { FormAlert } from '../../components/FormAlert.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { BudgetVersionTable } from '../../components/budgets/BudgetVersionTable.jsx'
import { CostBreakdown } from '../../components/budgets/CostBreakdown.jsx'
import { QuotationFacts } from '../../components/budgets/QuotationFacts.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { createBudget, getQuotationPreview, listBudgets } from '../../services/budgetService.js'
import { getProject } from '../../services/projectService.js'
import { isNothingToQuote } from '../../utils/budget.js'
import { isClosed } from '../../utils/projectStatus.js'
import { NotFoundPage } from '../NotFoundPage.jsx'
import { t } from '../../i18n/i18n.js'

/** The cost the project would have today, with the button to save it as a version. */
function CurrentQuotation({ projectId, closed }) {
  const navigate = useNavigate()
  const preview = useApiData((signal) => getQuotationPreview(projectId, { signal }), [projectId])
  const save = useCallback(
    () => createBudget(projectId).then((budget) => navigate(`/projects/${projectId}/budgets/${budget.id}`)),
    [projectId, navigate],
  )
  const saving = useFormSubmit(save)

  if (isNothingToQuote(preview.error)) {
    return (
      <section className="card">
        <h2>{t('budgetsPage.currentQuotation')}</h2>
        <p className="muted">{preview.error.message}.</p>
        <div className="button-row">
          <Link to={`/projects/${projectId}/measurements`} className="button-link">
            {t('budgetsPage.goToMeasurements')}
          </Link>
          <Link to={`/projects/${projectId}/blueprints`} className="button-link button-secondary">
            {t('budgetsPage.readABlueprintWithAi')}
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="card">
      <h2>{t('budgetsPage.currentQuotation')}</h2>
      {preview.status === 'error' && <FormAlert>{preview.error.message}</FormAlert>}
      {!preview.data && preview.status === 'loading' && <p className="muted">{t('budgetsPage.quotingTheProject')}</p>}
      {preview.data && (
        <>
          <p className="muted">
            {t('budgetsPage.source', {
              source:
                preview.data.measurementSource === 'ocr'
                  ? t('budgetsPage.measurementsReadByTheAi')
                  : t('budgetsPage.manualMeasurements'),
            })}
          </p>
          <QuotationFacts quotation={preview.data} />
          <CostBreakdown items={preview.data.items} total={preview.data.projectedAmount} />
          {preview.data.elementsWithoutFormulas.length > 0 && (
            <p className="muted">
              {t('budgetsPage.leftOutBecauseTheProject')} {preview.data.elementsWithoutFormulas.join(', ')}.
            </p>
          )}
        </>
      )}
      {closed ? (
        <p className="muted">{t('budgetsPage.theProjectIsClosedSo')}</p>
      ) : (
        <div className="button-row">
          <button type="button" disabled={saving.pending || !preview.data} onClick={() => saving.submit()}>
            {saving.pending ? t('budgetsPage.saving') : t('budgetsPage.saveAsANewVersion')}
          </button>
        </div>
      )}
      <FormAlert>{saving.error?.message}</FormAlert>
    </section>
  )
}

/** Quotation of a project and its saved budget versions. */
export function BudgetsPage() {
  const { id } = useParams()
  const project = useApiData((signal) => getProject(id, { signal }), [id])
  const versions = useApiData((signal) => listBudgets(id, { signal }), [id])

  if (project.error?.status === 404) return <NotFoundPage />
  const failed = [project, versions].find((request) => request.status === 'error')
  if (failed) return <ErrorState error={failed.error} onRetry={failed.retry} />
  if (!project.data || !versions.data) return <LoadingState title={t('budgetsPage.loadingTheBudget')} />

  return (
    <div className="workspace">
      <PageHeader
        title={t('budgetsPage.budget')}
        description={project.data.name}
        back={{ to: `/projects/${id}`, label: project.data.name }}
        actions={
          <>
            {versions.data.length > 0 && (
              <Link to={`/projects/${id}/materials`} className="button-link button-secondary">
                {t('budgetsPage.materialsToBuy')}
              </Link>
            )}
            <Link to={`/projects/${id}/expenses`} className="button-link button-secondary">
              {t('budgetsPage.expenses')}
            </Link>
          </>
        }
      />
      <CurrentQuotation projectId={id} closed={isClosed(project.data)} />
      <section className="card">
        <h2>{t('budgetsPage.savedVersions')}</h2>
        {versions.data.length === 0 ? (
          <p className="muted">{t('budgetsPage.noVersionSavedYetSave')}</p>
        ) : (
          <BudgetVersionTable projectId={id} versions={versions.data} />
        )}
      </section>
    </div>
  )
}
