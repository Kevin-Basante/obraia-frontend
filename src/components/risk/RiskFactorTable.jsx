import { formatPercent } from '../../utils/format.js'
import { factorDetail, factorLabel, formatScore, sortFactors } from '../../utils/risk.js'
import '../catalog/DataTable.css'
import { t } from '../../i18n/i18n.js'

/** The rules that scored the project (Strategy pattern in the backend), the highest first. */
export function RiskFactorTable({ factors }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th scope="col">{t('riskFactorTable.rule')}</th>
          <th scope="col" className="data-table__number">
            {t('riskFactorTable.weight')}
          </th>
          <th scope="col" className="data-table__number">
            {t('riskFactorTable.score')}
          </th>
          <th scope="col" className="data-table__number">
            {t('riskFactorTable.delay')}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortFactors(factors).map((factor) => (
          <tr key={factor.code}>
            <td data-label={t('riskFactorTable.rule')}>
              {/* One element, so on phones the rule and its detail stay together. */}
              <span>
                {factorLabel(factor)}
                <span className="muted"> · {factorDetail(factor)}</span>
              </span>
            </td>
            <td data-label={t('riskFactorTable.weight')} className="data-table__number">
              {formatPercent(factor.weight)}
            </td>
            <td data-label={t('riskFactorTable.score')} className="data-table__number">
              {formatScore(factor.score)}
            </td>
            <td data-label={t('riskFactorTable.delay')} className="data-table__number">
              {factor.delayDays > 0 ? `${factor.delayDays} d` : '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
