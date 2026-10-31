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
        <h2>Current quotation</h2>
        <p className="muted">{preview.error.message}.</p>
        <div className="button-row">
          <Link to={`/projects/${projectId}/measurements`} className="button-link">
            Go to measurements
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="card">
      <h2>Current quotation</h2>
      {preview.status === 'error' && <FormAlert>{preview.error.message}</FormAlert>}
      {!preview.data && preview.status === 'loading' && <p className="muted">Quoting the project…</p>}
      {preview.data && (
        <>
          <p className="muted">
            From the {preview.data.measurementSource === 'ocr' ? 'measurements read by the AI' : 'manual measurements'} and
            today&apos;s reference prices. Nothing is saved until you save a version.
          </p>
          <QuotationFacts quotation={preview.data} />
          <CostBreakdown items={preview.data.items} total={preview.data.projectedAmount} />
          {preview.data.elementsWithoutFormulas.length > 0 && (
            <p className="muted">
              Left out because the project type has no material formulas for them:{' '}
              {preview.data.elementsWithoutFormulas.join(', ')}.
            </p>
          )}
        </>
      )}
      {closed ? (
        <p className="muted">The project is closed, so no new versions can be saved.</p>
      ) : (
        <div className="button-row">
          <button type="button" disabled={saving.pending || !preview.data} onClick={() => saving.submit()}>
            {saving.pending ? 'Saving…' : 'Save as a new version'}
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
  if (!project.data || !versions.data) return <LoadingState title="Loading the budget…" />

  return (
    <div className="workspace">
      <PageHeader
        title="Budget"
        description={project.data.name}
        back={{ to: `/projects/${id}`, label: project.data.name }}
        actions={
          versions.data.length > 0 && (
            <Link to={`/projects/${id}/materials`} className="button-link button-secondary">
              Materials to buy
            </Link>
          )
        }
      />
      <CurrentQuotation projectId={id} closed={isClosed(project.data)} />
      <section className="card">
        <h2>Saved versions</h2>
        {versions.data.length === 0 ? (
          <p className="muted">No version saved yet. Save the current quotation to keep it and approve it.</p>
        ) : (
          <BudgetVersionTable projectId={id} versions={versions.data} />
        )}
      </section>
    </div>
  )
}
