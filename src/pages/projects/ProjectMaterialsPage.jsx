import { Link, useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { ProjectMaterialsTable } from '../../components/budgets/ProjectMaterialsTable.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { listProjectMaterials } from '../../services/budgetService.js'
import { NotFoundPage } from '../NotFoundPage.jsx'
import { t } from '../../i18n/i18n.js'

/** Materials to buy for the project, from the last saved quotation. */
export function ProjectMaterialsPage() {
  const { id } = useParams()
  const materials = useApiData((signal) => listProjectMaterials(id, { signal }), [id])

  if (materials.error?.status === 404) return <NotFoundPage />
  if (materials.status === 'error') return <ErrorState error={materials.error} onRetry={materials.retry} />
  if (!materials.data) return <LoadingState title={t('projectMaterialsPage.loadingTheMaterials')} />

  return (
    <div className="workspace">
      <PageHeader
        title={t('projectMaterialsPage.materialsToBuy')}
        description={t('projectMaterialsPage.quantitiesOfTheLastSaved')}
        back={{ to: `/projects/${id}/budgets`, label: t('projectMaterialsPage.budget') }}
      />
      <section className="card">
        {materials.data.length === 0 ? (
          <>
            <p className="muted">{t('projectMaterialsPage.theListAppearsAfterThe')}</p>
            <div className="button-row">
              <Link to={`/projects/${id}/budgets`} className="button-link">
                {t('projectMaterialsPage.goToTheBudget')}
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
