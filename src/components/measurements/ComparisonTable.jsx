import { comparisonLabel, formatDifference } from '../../utils/comparison.js'
import { formatAmount } from '../../utils/format.js'
import '../catalog/DataTable.css'
import './ComparisonTable.css'
import { codeText, t } from '../../i18n/i18n.js'

function amountOrDash(value, unit) {
  return value === null ? '—' : formatAmount(value, unit)
}

/** Manual and AI totals of each element and floor, with how far apart they are. */
export function ComparisonTable({ rows }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>{t('comparisonTable.element')}</th>
          <th>{t('comparisonTable.floor')}</th>
          <th className="data-table__number">{t('comparisonTable.manual')}</th>
          <th className="data-table__number">{t('comparisonTable.ai')}</th>
          <th className="data-table__number">{t('comparisonTable.difference')}</th>
          <th>{t('comparisonTable.result')}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={`${row.elementType}-${row.floorNumber}`}>
            <td data-label={t('comparisonTable.element')}>{codeText('element', row.elementType, row.elementLabel)}</td>
            <td data-label={t('comparisonTable.floor')}>{row.floorNumber}</td>
            <td data-label={t('comparisonTable.manual')} className="data-table__number">
              {amountOrDash(row.manualAmount, row.baseUnit)}
            </td>
            <td data-label="AI" className="data-table__number">
              {amountOrDash(row.aiAmount, row.baseUnit)}
            </td>
            <td data-label={t('comparisonTable.difference')} className="data-table__number">
              {formatDifference(row.differencePct)}
            </td>
            <td data-label={t('comparisonTable.result')}>
              <span className={`comparison-status comparison-status--${row.status}`}>
                {comparisonLabel(row.status)}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
