import { Link } from 'react-router'
import { shareOfTotal } from '../../utils/budget.js'
import { barWidth, moneyLevel } from '../../utils/dashboard.js'
import { formatCurrency, formatPercent } from '../../utils/format.js'
import { formatProgress } from '../../utils/workStatus.js'
import './DashboardCard.css'
import './MoneyPanel.css'

function versionText(money) {
  const quoted = `${money.budgetVersions} ${money.budgetVersions === 1 ? 'version' : 'versions'} quoted`
  return money.approvedVersion === null
    ? `${quoted}, none approved`
    : `Version ${money.approvedVersion} approved · ${quoted}`
}

/** Approved budget against what was spent, and what each category of expense takes. */
export function MoneyPanel({ projectId, money }) {
  const level = moneyLevel(money)
  const over = level === 'over'

  return (
    <section className="card">
      <div className="dashboard-card__header">
        <h2>Budget and expenses</h2>
        <span className="money-panel__links">
          <Link to={`/projects/${projectId}/budgets`}>Budget</Link>
          <Link to={`/projects/${projectId}/expenses`}>Expenses</Link>
        </span>
      </div>
      <p className="muted">{versionText(money)}</p>
      <dl className="money-panel__facts">
        <div>
          <dt>Spent</dt>
          <dd>{formatCurrency(money.totalSpent)}</dd>
        </div>
        <div>
          <dt>Approved budget</dt>
          <dd>{level === 'none' ? '—' : formatCurrency(money.approvedBudget)}</dd>
        </div>
        <div>
          <dt>{over ? 'Over budget' : 'Remaining'}</dt>
          <dd className={over ? 'money-panel__over' : undefined}>
            {level === 'none' ? '—' : formatCurrency(Math.abs(Number(money.remaining)))}
          </dd>
        </div>
      </dl>
      {level !== 'none' && (
        <div className={`money-panel__gauge money-panel__gauge--${level}`}>
          <span className="money-panel__track" aria-hidden="true">
            <span style={{ width: `${barWidth(money.spentPct)}%` }} />
          </span>
          <p>{formatProgress(money.spentPct)} of the approved budget is spent</p>
        </div>
      )}
      <h3>Spent by category</h3>
      {money.byCategory.length === 0 ? (
        <p className="muted">No expenses registered yet.</p>
      ) : (
        <ul className="money-panel__categories">
          {money.byCategory.map((total) => {
            const share = shareOfTotal(total.amount, money.totalSpent)
            return (
              <li key={total.category.code}>
                <span className="money-panel__category">
                  <span>{total.category.label}</span>
                  <span>
                    {formatCurrency(total.amount)} · {formatPercent(share)}
                  </span>
                </span>
                <span className="money-panel__share" aria-hidden="true">
                  <span style={{ width: `${barWidth(share * 100)}%` }} />
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
