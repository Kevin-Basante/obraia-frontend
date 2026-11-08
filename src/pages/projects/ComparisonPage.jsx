import { useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { ComparisonTable } from '../../components/measurements/ComparisonTable.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { getMeasurementComparison } from '../../services/measurementService.js'
import { formatQuantity } from '../../utils/format.js'
import { NotFoundPage } from '../NotFoundPage.jsx'
import { t } from '../../i18n/i18n.js'

/** Manual measurements against the ones read by the AI, by element and floor. */
export function ComparisonPage() {
  const { id } = useParams()
  const comparison = useApiData((signal) => getMeasurementComparison(id, { signal }), [id])

  if (comparison.error?.status === 404) return <NotFoundPage />
  if (comparison.status === 'error') return <ErrorState error={comparison.error} onRetry={comparison.retry} />
  if (!comparison.data) return <LoadingState title={t('comparisonPage.loadingTheComparison')} />

  const { rows, aiAvailable, tolerancePct } = comparison.data

  return (
    <div className="workspace">
      <PageHeader
        title={t('comparisonPage.manualVsAi')}
        description={t('comparisonPage.tolerance', { pct: formatQuantity(tolerancePct) })}
        back={{ to: `/projects/${id}/measurements`, label: t('comparisonPage.measurements') }}
      />
      <section className="card">
        {!aiAvailable && <p className="muted">{t('comparisonPage.theAiHasNotRead')}</p>}
        {rows.length === 0 ? (
          <p className="muted">{t('comparisonPage.thereAreNoMeasurementsTo')}</p>
        ) : (
          <ComparisonTable rows={rows} />
        )}
      </section>
    </div>
  )
}
