import { Link, useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { ProjectMaterialsTable } from '../../components/budgets/ProjectMaterialsTable.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { listProjectMaterials } from '../../services/budgetService.js'
import { NotFoundPage } from '../NotFoundPage.jsx'

/** Materials to buy for the project, from the last saved quotation. */
export function ProjectMaterialsPage() {
  const { id } = useParams()
  const materials = useApiData((signal) => listProjectMaterials(id, { signal }), [id])

  if (materials.error?.status === 404) return <NotFoundPage />
  if (materials.status === 'error') return <ErrorState error={materials.error} onRetry={materials.retry} />
  if (!materials.data) return <LoadingState title="Loading the materials…" />

  return (
    <div className="workspace">
      <PageHeader
        title="Materials to buy"
        description="Quantities of the last saved version, waste included, with the price of that day."
        back={{ to: `/projects/${id}/budgets`, label: 'Budget' }}
      />
      <section className="card">
        {materials.data.length === 0 ? (
          <>
            <p className="muted">The list appears after the first version of the budget is saved.</p>
            <div className="button-row">
              <Link to={`/projects/${id}/budgets`} className="button-link">
                Go to the budget
              </Link>
            </div>
          </>
        ) : (
          <ProjectMaterialsTable materials={materials.data} />
        )}
      </section>
    </div>
  )
}
