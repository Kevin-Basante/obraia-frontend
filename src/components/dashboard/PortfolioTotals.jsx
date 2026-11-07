import { formatCurrency } from '../../utils/format.js'
import { formatProgress } from '../../utils/workStatus.js'
import { KpiTile } from './KpiTile.jsx'

/** Totals of every project of the user, on top of the main dashboard. */
export function PortfolioTotals({ portfolio }) {
  const spentShare =
    Number(portfolio.approvedBudget) > 0
      ? (Number(portfolio.totalSpent) * 100) / Number(portfolio.approvedBudget)
      : null

  return (
    <div className="kpi-row">
      <KpiTile label="Projects" value={portfolio.projectCount} detail={`${portfolio.active} in progress`} />
      <KpiTile
        label="At risk"
        value={portfolio.atRisk}
        detail={portfolio.atRisk === 0 ? 'No project with high risk' : 'With high or critical risk'}
        tone={portfolio.atRisk > 0 ? 'bad' : 'ok'}
      />
      <KpiTile
        label="Approved budgets"
        value={formatCurrency(portfolio.approvedBudget)}
        detail="Sum of the approved version of each project"
      />
      <KpiTile
        label="Spent"
        value={formatCurrency(portfolio.totalSpent)}
        detail={
          spentShare === null
            ? 'No approved budget to compare with'
            : `${formatProgress(spentShare)} of the approved budgets`
        }
        tone={spentShare !== null && spentShare > 100 ? 'bad' : 'neutral'}
      />
    </div>
  )
}
