import { useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { ComparisonTable } from '../../components/measurements/ComparisonTable.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { getMeasurementComparison } from '../../services/measurementService.js'
import { formatQuantity } from '../../utils/format.js'
import { NotFoundPage } from '../NotFoundPage.jsx'

/** Manual measurements against the ones read by the AI, by element and floor. */
export function ComparisonPage() {
  const { id } = useParams()
  const comparison = useApiData((signal) => getMeasurementComparison(id, { signal }), [id])

  if (comparison.error?.status === 404) return <NotFoundPage />
  if (comparison.status === 'error') return <ErrorState error={comparison.error} onRetry={comparison.retry} />
  if (!comparison.data) return <LoadingState title="Loading the comparison…" />

  const { rows, aiAvailable, tolerancePct } = comparison.data

  return (
    <div className="workspace">
      <PageHeader
        title="Manual vs. AI"
        description={`A difference up to ${formatQuantity(tolerancePct)}% counts as a match.`}
        back={{ to: `/projects/${id}/measurements`, label: 'Measurements' }}
      />
      <section className="card">
        {!aiAvailable && (
          <p className="muted">The AI has not read any blueprint of this project yet, so only the manual totals appear.</p>
        )}
        {rows.length === 0 ? (
          <p className="muted">There are no measurements to compare yet.</p>
        ) : (
          <ComparisonTable rows={rows} />
        )}
      </section>
    </div>
  )
}
