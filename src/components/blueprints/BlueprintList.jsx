import { Link } from 'react-router'
import { analyzeLabel } from '../../utils/analysis.js'
import { formatDateTime, formatFileSize } from '../../utils/format.js'
import { StatusBadge } from '../projects/StatusBadge.jsx'
import '../catalog/DataTable.css'
import { codeText, t } from '../../i18n/i18n.js'

/**
 * Blueprints of a project as a table. Each one opens its viewer. `onAnalyze`
 * and `onDelete` are left out when the project is closed; `analyzingId` is
 * the blueprint the AI is reading now.
 */
export function BlueprintList({ projectId, blueprints, onAnalyze, analyzingId, onDelete, deleting }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>{t('blueprintList.file')}</th>
          <th>{t('blueprintList.type')}</th>
          <th className="data-table__number">{t('blueprintList.size')}</th>
          <th>{t('blueprintList.uploaded')}</th>
          <th>{t('blueprintList.aiReading')}</th>
          <th>
            <span className="visually-hidden">{t('blueprintList.actions')}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {blueprints.map((blueprint) => (
          <tr key={blueprint.id}>
            <td data-label={t('blueprintList.file')}>
              <Link to={`/projects/${projectId}/blueprints/${blueprint.id}`}>{blueprint.originalFilename}</Link>
            </td>
            <td data-label={t('blueprintList.type')}>
              {codeText('fileType', blueprint.fileType, blueprint.fileTypeLabel)}
            </td>
            <td data-label={t('blueprintList.size')} className="data-table__number">
              {formatFileSize(blueprint.sizeBytes)}
            </td>
            <td data-label={t('blueprintList.uploaded')}>{formatDateTime(blueprint.uploadedAt)}</td>
            <td data-label={t('blueprintList.aiReading')}>
              <StatusBadge status={blueprint.processingStatus} />
            </td>
            <td data-label={t('blueprintList.actions')}>
              <div className="button-row">
                {onAnalyze && (
                  <button
                    type="button"
                    className="button-small"
                    disabled={Boolean(analyzingId) || deleting}
                    onClick={() => onAnalyze(blueprint)}
                  >
                    {analyzingId === blueprint.id ? t('blueprintList.reading') : analyzeLabel(blueprint)}
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    className="button-secondary button-small"
                    disabled={deleting || Boolean(analyzingId)}
                    onClick={() => onDelete(blueprint)}
                  >
                    {t('blueprintList.delete')}
                  </button>
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
