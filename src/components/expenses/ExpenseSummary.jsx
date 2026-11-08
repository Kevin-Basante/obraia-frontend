import { shareOfTotal } from '../../utils/budget.js'
import { formatCurrency, formatPercent } from '../../utils/format.js'
import { ProgressBar } from '../phases/ProgressBar.jsx'
import '../budgets/QuotationFacts.css'
import '../catalog/DataTable.css'
import './ExpenseSummary.css'
import { codeLabel, t } from '../../i18n/i18n.js'

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
          <dt>{t('expenseSummary.spent')}</dt>
          <dd>{formatCurrency(summary.totalSpent)}</dd>
        </div>
        <div>
          <dt>{t('expenseSummary.approvedBudget')}</dt>
          <dd>{hasBudget ? formatCurrency(summary.approvedBudget) : t('expenseSummary.notApprovedYet')}</dd>
        </div>
        {hasBudget && (
          <div>
            <dt>{over ? t('expenseSummary.overBudget') : t('expenseSummary.remaining')}</dt>
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
              {t('expenseSummary.spentShare', { share: formatPercent(Number(summary.spentPct) / 100) })}
            </p>
          ) : (
            <ProgressBar value={summary.spentPct} label={t('expenseSummary.approvedBudgetSpent')} />
          )}
        </div>
      )}
      {summary.byCategory.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">{t('expenseSummary.category')}</th>
              <th scope="col" className="data-table__number">
                {t('expenseSummary.expenses')}
              </th>
              <th scope="col" className="data-table__number">
                {t('expenseSummary.amount')}
              </th>
              <th scope="col" className="data-table__number">
                {t('expenseSummary.share')}
              </th>
            </tr>
          </thead>
          <tbody>
            {summary.byCategory.map((total) => (
              <tr key={total.category.code}>
                <td data-label={t('expenseSummary.category')}>{codeLabel('expenseCategory', total.category)}</td>
                <td data-label={t('expenseSummary.expenses')} className="data-table__number">
                  {total.count}
                </td>
                <td data-label={t('expenseSummary.amount')} className="data-table__number">
                  {formatCurrency(total.amount)}
                </td>
                <td data-label={t('expenseSummary.share')} className="data-table__number">
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
