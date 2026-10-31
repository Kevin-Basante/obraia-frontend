import { Link } from 'react-router'
import { analysisSummary } from '../../utils/analysis.js'
import { MeasurementTable } from '../measurements/MeasurementTable.jsx'

/** What the AI read in a blueprint: a summary, its warnings and the measurements it saved. */
export function AnalysisResult({ projectId, filename, result }) {
  return (
    <section className="card" aria-live="polite">
      <h2>AI reading of {filename}</h2>
      <p className="muted">
        {analysisSummary(result)} Model: {result.model}.
      </p>
      {result.warnings.length > 0 && (
        <>
          <h3>Warnings</h3>
          <ul>
            {result.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </>
      )}
      {result.measurements.length > 0 && <MeasurementTable measurements={result.measurements} />}
      <div className="button-row">
        <Link to={`/projects/${projectId}/measurements/comparison`} className="button-link">
          Compare with the manual measurements
        </Link>
      </div>
    </section>
  )
}
