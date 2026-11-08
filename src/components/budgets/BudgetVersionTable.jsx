import { Link } from 'react-router'
import { formatCurrency, formatDateTime } from '../../utils/format.js'
import { StatusBadge } from '../projects/StatusBadge.jsx'
import '../catalog/DataTable.css'
import { t } from '../../i18n/i18n.js'

/** Saved versions of the budget, newest first, each one with a link to its rows. Only the approved one has spending. */
export function BudgetVersionTable({ projectId, versions }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th scope="col">{t('budgetVersionTable.version')}</th>
          <th scope="col">{t('budgetVersionTable.status')}</th>
          <th scope="col" className="data-table__number">
            {t('budgetVersionTable.projectedAmount')}
          </th>
          <th scope="col" className="data-table__number">
            {t('budgetVersionTable.spent')}
          </th>
          <th scope="col">{t('budgetVersionTable.saved')}</th>
          <th scope="col">{t('budgetVersionTable.approved')}</th>
        </tr>
      </thead>
      <tbody>
        {versions.map((version) => (
          <tr key={version.id}>
            <td data-label={t('budgetVersionTable.version')}>
              <Link to={`/projects/${projectId}/budgets/${version.id}`}>
                {t('budgetVersionTable.version')} {version.version}
              </Link>
            </td>
            <td data-label={t('budgetVersionTable.status')}>
              <StatusBadge status={version.status} />
            </td>
            <td data-label={t('budgetVersionTable.projectedAmount')} className="data-table__number">
              {formatCurrency(version.projectedAmount)}
            </td>
            <td data-label={t('budgetVersionTable.spent')} className="data-table__number">
              {version.status.code === 'approved' ? formatCurrency(version.actualAmount) : '—'}
            </td>
            <td data-label={t('budgetVersionTable.saved')}>{formatDateTime(version.createdAt)}</td>
            <td data-label={t('budgetVersionTable.approved')}>
              {version.approvedAt ? formatDateTime(version.approvedAt) : '—'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
