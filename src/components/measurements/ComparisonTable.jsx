import { comparisonLabel, formatDifference } from '../../utils/comparison.js'
import { formatAmount } from '../../utils/format.js'
import '../catalog/DataTable.css'
import './ComparisonTable.css'

function amountOrDash(value, unit) {
  return value === null ? '—' : formatAmount(value, unit)
}

/** Manual and AI totals of each element and floor, with how far apart they are. */
export function ComparisonTable({ rows }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Element</th>
          <th>Floor</th>
          <th className="data-table__number">Manual</th>
          <th className="data-table__number">AI</th>
          <th className="data-table__number">Difference</th>
          <th>Result</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.elementType}-${row.floorNumber}`}>
            <td data-label="Element">{row.elementLabel}</td>
            <td data-label="Floor">{row.floorNumber}</td>
            <td data-label="Manual" className="data-table__number">
              {amountOrDash(row.manualAmount, row.baseUnit)}
            </td>
            <td data-label="AI" className="data-table__number">
              {amountOrDash(row.aiAmount, row.baseUnit)}
            </td>
            <td data-label="Difference" className="data-table__number">
              {formatDifference(row.differencePct)}
            </td>
            <td data-label="Result">
              <span className={`comparison-status comparison-status--${row.status}`}>{comparisonLabel(row.status)}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
