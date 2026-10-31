import { formatRate, shareOfTotal } from '../../utils/budget.js'
import { formatCurrency, formatPercent } from '../../utils/format.js'
import '../catalog/DataTable.css'
import './CostBreakdown.css'

/**
 * The layers of the cost, one row each, in the order the backend adds them:
 * materials, waste, transport, labor and VAT (Decorator pattern).
 */
export function CostBreakdown({ items, total }) {
  return (
    <table className="data-table cost-breakdown">
      <thead>
        <tr>
          <th scope="col">Layer</th>
          <th scope="col">Detail</th>
          <th scope="col" className="data-table__number">
            Rate
          </th>
          <th scope="col" className="data-table__number">
            Amount
          </th>
          <th scope="col" className="data-table__number">
            Share
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.itemType}>
            <td data-label="Layer">{item.label}</td>
            <td data-label="Detail">{item.description}</td>
            <td data-label="Rate" className="data-table__number">
              {formatRate(item.percentage)}
            </td>
            <td data-label="Amount" className="data-table__number">
              {formatCurrency(item.amount)}
            </td>
            <td data-label="Share" className="data-table__number">
              {formatPercent(shareOfTotal(item.amount, total))}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="cost-breakdown__total">
          <th scope="row" colSpan={3}>
            Total
          </th>
          <td data-label="Total" className="data-table__number">
            {formatCurrency(total)}
          </td>
          <td className="data-table__number">100%</td>
        </tr>
      </tfoot>
    </table>
  )
}
