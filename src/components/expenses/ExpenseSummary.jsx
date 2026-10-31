import { shareOfTotal } from '../../utils/budget.js'
import { formatCurrency, formatPercent } from '../../utils/format.js'
import { ProgressBar } from '../phases/ProgressBar.jsx'
import '../budgets/QuotationFacts.css'
import '../catalog/DataTable.css'
import './ExpenseSummary.css'

/**
 * Total spent against the approved budget and the total of each category.
 * Without an approved budget only the totals are shown.
 */
export function ExpenseSummary({ summary }) {
  const hasBudget = summary.approvedBudget !== null
  const over = hasBudget && Number(summary.remaining) < 0

  return (
    <>
      <dl className="quotation-facts">
        <div>
          <dt>Spent</dt>
          <dd>{formatCurrency(summary.totalSpent)}</dd>
        </div>
        <div>
          <dt>Approved budget</dt>
          <dd>{hasBudget ? formatCurrency(summary.approvedBudget) : 'Not approved yet'}</dd>
        </div>
        {hasBudget && (
          <div>
            <dt>{over ? 'Over budget' : 'Remaining'}</dt>
            <dd className={over ? 'expense-summary__over' : undefined}>
              {formatCurrency(Math.abs(Number(summary.remaining)))}
            </dd>
          </div>
        )}
      </dl>
      {hasBudget && (
        <div className="expense-summary__bar">
          {/* The bar stops at 100%, so a passed budget is told in words. */}
          {over ? (
            <p className="expense-summary__over">
              {formatPercent(Number(summary.spentPct) / 100)} of the approved budget is spent.
            </p>
          ) : (
            <ProgressBar value={summary.spentPct} label="Approved budget spent" />
          )}
        </div>
      )}
      {summary.byCategory.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col" className="data-table__number">
                Expenses
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
            {summary.byCategory.map((total) => (
              <tr key={total.category.code}>
                <td data-label="Category">{total.category.label}</td>
                <td data-label="Expenses" className="data-table__number">
                  {total.count}
                </td>
                <td data-label="Amount" className="data-table__number">
                  {formatCurrency(total.amount)}
                </td>
                <td data-label="Share" className="data-table__number">
                  {formatPercent(shareOfTotal(total.amount, summary.totalSpent))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
