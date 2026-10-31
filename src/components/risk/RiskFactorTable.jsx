import { formatPercent } from '../../utils/format.js'
import { formatScore, sortFactors } from '../../utils/risk.js'
import '../catalog/DataTable.css'

/** The rules that scored the project (Strategy pattern in the backend), the highest first. */
export function RiskFactorTable({ factors }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th scope="col">Rule</th>
          <th scope="col" className="data-table__number">
            Weight
          </th>
          <th scope="col" className="data-table__number">
            Score
          </th>
          <th scope="col" className="data-table__number">
            Delay
          </th>
        </tr>
      </thead>
      <tbody>
        {sortFactors(factors).map((factor) => (
          <tr key={factor.code}>
            <td data-label="Rule">
              {factor.label}
              <span className="muted"> · {factor.detail}</span>
            </td>
            <td data-label="Weight" className="data-table__number">
              {formatPercent(factor.weight)}
            </td>
            <td data-label="Score" className="data-table__number">
              {formatScore(factor.score)}
            </td>
            <td data-label="Delay" className="data-table__number">
              {factor.delayDays > 0 ? `${factor.delayDays} d` : '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
