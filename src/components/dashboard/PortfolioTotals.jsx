import { formatCurrency } from '../../utils/format.js'
import { formatProgress } from '../../utils/workStatus.js'
import { KpiTile } from './KpiTile.jsx'
import { t } from '../../i18n/i18n.js'

/** Totals of every project of the user, on top of the main dashboard. */
export function PortfolioTotals({ portfolio }) {
  const spentShare =
    Number(portfolio.approvedBudget) > 0
      ? (Number(portfolio.totalSpent) * 100) / Number(portfolio.approvedBudget)
      : null

  return (
    <div className="kpi-row">
      <KpiTile
        label={t('portfolioTotals.projects')}
        value={portfolio.projectCount}
        detail={t('portfolioTotals.inProgress', { count: portfolio.active })}
      />
      <KpiTile
        label={t('portfolioTotals.atRisk')}
        value={portfolio.atRisk}
        detail={
          portfolio.atRisk === 0
            ? t('portfolioTotals.noProjectWithHighRisk')
            : t('portfolioTotals.withHighOrCriticalRisk')
        }
        tone={portfolio.atRisk > 0 ? 'bad' : 'ok'}
      />
      <KpiTile
        label={t('portfolioTotals.approvedBudgets')}
        value={formatCurrency(portfolio.approvedBudget)}
        detail={t('portfolioTotals.sumOfTheApprovedVersion')}
      />
      <KpiTile
        label={t('portfolioTotals.spent')}
        value={formatCurrency(portfolio.totalSpent)}
        detail={
          spentShare === null
            ? t('portfolioTotals.noApprovedBudgetToCompare')
            : t('portfolioTotals.ofBudgets', { share: formatProgress(spentShare) })
        }
        tone={spentShare !== null && spentShare > 100 ? 'bad' : 'neutral'}
      />
    </div>
  )
}
