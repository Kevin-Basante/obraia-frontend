import { formatRate, shareOfTotal } from '../../utils/budget.js'
import { formatCurrency, formatPercent } from '../../utils/format.js'
import '../catalog/DataTable.css'
import './CostBreakdown.css'
import { budgetItemText } from '../../utils/budgetText.js'
import { codeText, t } from '../../i18n/i18n.js'

/**
 * The layers of the cost, one row each, in the order the backend adds them:
 * materials, waste, transport, labor and VAT (Decorator pattern).
 */
export function CostBreakdown({ items, total }) {
  return (
    <table className="data-table cost-breakdown">
      <thead>
        <tr>
          <th scope="col">{t('costBreakdown.layer')}</th>
          <th scope="col">{t('costBreakdown.detail')}</th>
          <th scope="col" className="data-table__number">
            {t('costBreakdown.rate')}
          </th>
          <th scope="col" className="data-table__number">
            {t('costBreakdown.amount')}
          </th>
          <th scope="col" className="data-table__number">
            {t('costBreakdown.share')}
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.itemType}>
            <td data-label={t('costBreakdown.layer')}>{codeText('budgetItem', item.itemType, item.label)}</td>
            <td data-label={t('costBreakdown.detail')}>{budgetItemText(item)}</td>
            <td data-label={t('costBreakdown.rate')} className="data-table__number">
              {formatRate(item.percentage)}
            </td>
            <td data-label={t('costBreakdown.amount')} className="data-table__number">
              {formatCurrency(item.amount)}
            </td>
            <td data-label={t('costBreakdown.share')} className="data-table__number">
              {formatPercent(shareOfTotal(item.amount, total))}
            </td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr className="cost-breakdown__total">
          <th scope="row" colSpan={3}>
            {t('costBreakdown.total')}
          </th>
          <td data-label={t('costBreakdown.total')} className="data-table__number">
            {formatCurrency(total)}
          </td>
          <td className="data-table__number">100%</td>
        </tr>
      </tfoot>
    </table>
  )
}
