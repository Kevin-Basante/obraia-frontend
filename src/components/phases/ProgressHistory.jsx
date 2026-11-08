import { formatDate } from '../../utils/format.js'
import { formatProgress } from '../../utils/workStatus.js'
import '../catalog/DataTable.css'
import { t } from '../../i18n/i18n.js'

/** Progress reports of a task, newest first. The first one is its current progress. */
export function ProgressHistory({ reports }) {
  if (reports.length === 0) return <p className="muted">{t('progressHistory.nobodyHasReportedProgressOn')}</p>
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>{t('progressHistory.date')}</th>
          <th className="data-table__number">{t('progressHistory.progress')}</th>
          <th>{t('progressHistory.reportedBy')}</th>
          <th>{t('progressHistory.notes')}</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report) => (
          <tr key={report.id}>
            <td data-label={t('progressHistory.date')}>{formatDate(report.reportDate)}</td>
            <td data-label={t('progressHistory.progress')} className="data-table__number">
              {formatProgress(report.completionPercentage)}
            </td>
            <td data-label={t('progressHistory.reportedBy')}>
              {report.reportedBy ?? '—'}
              {report.siteManager && (
                <span className="muted">
                  {' '}
                  {t('progressHistory.siteManager')} {report.siteManager}
                </span>
              )}
            </td>
            <td data-label={t('progressHistory.notes')}>{report.notes ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
