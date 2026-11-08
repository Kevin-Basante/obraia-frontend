import { Link } from 'react-router'
import { shareOfTotal } from '../../utils/budget.js'
import { barWidth, moneyLevel } from '../../utils/dashboard.js'
import { formatCurrency, formatPercent } from '../../utils/format.js'
import { formatProgress } from '../../utils/workStatus.js'
import './DashboardCard.css'
import './MoneyPanel.css'
import { codeLabel, t } from '../../i18n/i18n.js'

function versionText(money) {
  const quoted = t('moneyPanel.quoted', { count: money.budgetVersions })
  return money.approvedVersion === null
    ? t('moneyPanel.noneApproved', { quoted })
    : t('moneyPanel.approvedVersion', { version: money.approvedVersion, quoted })
}

/** Approved budget against what was spent, and what each category of expense takes. */
export function MoneyPanel({ projectId, money }) {
  const level = moneyLevel(money)
  const over = level === 'over'

  return (
    <section className="card">
      <div className="dashboard-card__header">
        <h2>{t('moneyPanel.budgetAndExpenses')}</h2>
        <span className="money-panel__links">
          <Link to={`/projects/${projectId}/budgets`}>{t('moneyPanel.budget')}</Link>
          <Link to={`/projects/${projectId}/expenses`}>{t('moneyPanel.expenses')}</Link>
        </span>
      </div>
      <p className="muted">{versionText(money)}</p>
      <dl className="money-panel__facts">
        <div>
          <dt>{t('moneyPanel.spent')}</dt>
          <dd>{formatCurrency(money.totalSpent)}</dd>
        </div>
        <div>
          <dt>{t('moneyPanel.approvedBudget')}</dt>
          <dd>{level === 'none' ? '—' : formatCurrency(money.approvedBudget)}</dd>
        </div>
        <div>
          <dt>{over ? t('moneyPanel.overBudget') : t('moneyPanel.remaining')}</dt>
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
          <p>{t('moneyPanel.spentShare', { share: formatProgress(money.spentPct) })}</p>
        </div>
      )}
      <h3>{t('moneyPanel.spentByCategory')}</h3>
      {money.byCategory.length === 0 ? (
        <p className="muted">{t('moneyPanel.noExpensesRegisteredYet')}</p>
      ) : (
        <ul className="money-panel__categories">
          {money.byCategory.map((total) => {
            const share = shareOfTotal(total.amount, money.totalSpent)
            return (
              <li key={total.category.code}>
                <span className="money-panel__category">
                  <span>{codeLabel('expenseCategory', total.category)}</span>
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
