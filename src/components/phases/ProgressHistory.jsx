import { formatDate } from '../../utils/format.js'
import { formatProgress } from '../../utils/workStatus.js'
import '../catalog/DataTable.css'

/** Progress reports of a task, newest first. The first one is its current progress. */
export function ProgressHistory({ reports }) {
  if (reports.length === 0) return <p className="muted">Nobody has reported progress on this task yet.</p>
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Date</th>
          <th className="data-table__number">Progress</th>
          <th>Reported by</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr key={report.id}>
            <td data-label="Date">{formatDate(report.reportDate)}</td>
            <td data-label="Progress" className="data-table__number">
              {formatProgress(report.completionPercentage)}
            </td>
            <td data-label="Reported by">
              {report.reportedBy ?? '—'}
              {report.siteManager && <span className="muted"> · site manager {report.siteManager}</span>}
            </td>
            <td data-label="Notes">{report.notes ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
