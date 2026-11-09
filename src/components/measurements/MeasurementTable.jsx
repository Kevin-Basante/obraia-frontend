import { formatDifference } from '../../utils/comparison.js'
import { formatAmount, formatQuantity } from '../../utils/format.js'
import '../catalog/DataTable.css'
import { codeText, t } from '../../i18n/i18n.js'

function dimensions(measurement) {
  return [measurement.lengthM, measurement.widthM, measurement.heightM]
    .filter((value) => value !== null)
    .map(formatQuantity)
    .join(' × ')
}

/**
 * Measurements of a project. Only manual ones can be changed, and only
 * while the project is open: `onEdit` and `onDelete` are left out otherwise.
 * `showBlueprint` is false when every row comes from the same blueprint.
 */
export function MeasurementTable({ measurements, onEdit, onDelete, busy, showBlueprint = true }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>{t('measurementTable.element')}</th>
          <th>{t('measurementTable.floor')}</th>
          <th>{t('measurementTable.dimensionsM')}</th>
          <th className="data-table__number">{t('measurementTable.quantity')}</th>
          <th className="data-table__number">{t('measurementTable.amount')}</th>
          <th>{t('measurementTable.source')}</th>
          <th>
            <span className="visually-hidden">{t('measurementTable.actions')}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {measurements.map((measurement) => (
          <tr key={measurement.id}>
            <td data-label={t('measurementTable.element')}>
              {codeText('element', measurement.elementType, measurement.elementLabel)}
              {measurement.notes && <span className="muted"> · {measurement.notes}</span>}
              {showBlueprint && measurement.blueprintFilename && (
                <span className="muted"> · {measurement.blueprintFilename}</span>
              )}
            </td>
            <td data-label={t('measurementTable.floor')}>{measurement.floorNumber}</td>
            <td data-label={t('measurementTable.dimensionsM')}>{dimensions(measurement)}</td>
            <td data-label={t('measurementTable.quantity')} className="data-table__number">
              {measurement.quantity}
            </td>
            <td data-label={t('measurementTable.amount')} className="data-table__number">
              {formatAmount(measurement.amount, measurement.baseUnit)}
            </td>
            <td data-label={t('measurementTable.source')}>
              {codeText('source', measurement.source, measurement.sourceLabel)}
              {measurement.discrepancyPct !== null && measurement.discrepancyPct !== undefined && (
                <span className="muted" title={t('measurementTable.differenceWithTheManualTotal')}>
                  {' '}
                  · {formatDifference(measurement.discrepancyPct)}
                </span>
              )}
            </td>
            <td data-label={t('measurementTable.actions')}>
              {measurement.source === 'manual' && onEdit && (
                <div className="button-row">
                  <button
                    type="button"
                    className="button-secondary button-small"
                    disabled={busy}
                    onClick={() => onEdit(measurement)}
                  >
                    {t('measurementTable.edit')}
                  </button>
                  <button
                    type="button"
                    className="button-secondary button-small"
                    disabled={busy}
                    onClick={() => onDelete(measurement)}
                  >
                    {t('measurementTable.delete')}
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
