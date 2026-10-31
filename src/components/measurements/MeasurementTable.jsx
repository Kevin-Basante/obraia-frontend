import { formatDifference } from '../../utils/comparison.js'
import { formatAmount, formatQuantity } from '../../utils/format.js'
import '../catalog/DataTable.css'

function dimensions(measurement) {
  return [measurement.lengthM, measurement.widthM, measurement.heightM]
    .filter((value) => value !== null)
    .map(formatQuantity)
    .join(' × ')
}

/**
 * Measurements of a project. Only manual ones can be changed, and only
 * while the project is open: `onEdit` and `onDelete` are left out otherwise.
 */
export function MeasurementTable({ measurements, onEdit, onDelete, busy }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Element</th>
          <th>Floor</th>
          <th>Dimensions (m)</th>
          <th className="data-table__number">Quantity</th>
          <th className="data-table__number">Amount</th>
          <th>Source</th>
          <th>
            <span className="visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {measurements.map((measurement) => (
          <tr key={measurement.id}>
            <td data-label="Element">
              {measurement.elementLabel}
              {measurement.notes && <span className="muted"> · {measurement.notes}</span>}
              {measurement.blueprintFilename && <span className="muted"> · {measurement.blueprintFilename}</span>}
            </td>
            <td data-label="Floor">{measurement.floorNumber}</td>
            <td data-label="Dimensions (m)">{dimensions(measurement)}</td>
            <td data-label="Quantity" className="data-table__number">
              {measurement.quantity}
            </td>
            <td data-label="Amount" className="data-table__number">
              {formatAmount(measurement.amount, measurement.baseUnit)}
            </td>
            <td data-label="Source">
              {measurement.sourceLabel}
              {measurement.discrepancyPct !== null && measurement.discrepancyPct !== undefined && (
                <span className="muted" title="Difference with the manual total of this element and floor">
                  {' '}
                  · {formatDifference(measurement.discrepancyPct)}
                </span>
              )}
            </td>
            <td data-label="Actions">
              {measurement.source === 'manual' && onEdit && (
                <div className="button-row">
                  <button
                    type="button"
                    className="button-secondary button-small"
                    disabled={busy}
                    onClick={() => onEdit(measurement)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="button-secondary button-small"
                    disabled={busy}
                    onClick={() => onDelete(measurement)}
                  >
                    Delete
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
