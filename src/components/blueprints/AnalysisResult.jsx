import { Link } from 'react-router'
import { analysisSummary } from '../../utils/analysis.js'
import { MeasurementTable } from '../measurements/MeasurementTable.jsx'
import { t } from '../../i18n/i18n.js'

/** What the AI read in a blueprint: a summary, its warnings and the measurements it saved. */
export function AnalysisResult({ projectId, filename, result }) {
  return (
    <section className="card" aria-live="polite">
      <h2>{t('analysisResult.title', { name: filename })}</h2>
      <p className="muted">
        {analysisSummary(result)} {t('analysisResult.model', { model: result.model })}
      </p>
      {result.warnings.length > 0 && (
        <>
          <h3>{t('analysisResult.warnings')}</h3>
          <ul>
            {result.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </>
      )}
      {result.measurements.length > 0 && <MeasurementTable measurements={result.measurements} showBlueprint={false} />}
      <div className="button-row">
        <Link to={`/projects/${projectId}/measurements/comparison`} className="button-link">
          {t('analysisResult.compareWithTheManualMeasurements')}
        </Link>
      </div>
    </section>
  )
}
