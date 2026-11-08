import { formatCurrency, formatDate } from '../../utils/format.js'
import '../catalog/DataTable.css'
import { codeLabel, t } from '../../i18n/i18n.js'

/** Expenses of a project, newest first. `onDelete` is left out when the project is closed. */
export function ExpenseTable({ expenses, onDelete, busy }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th scope="col">{t('expenseTable.date')}</th>
          <th scope="col">{t('expenseTable.category')}</th>
          <th scope="col">{t('expenseTable.description')}</th>
          <th scope="col">{t('expenseTable.registeredBy')}</th>
          <th scope="col" className="data-table__number">
            {t('expenseTable.amount')}
          </th>
          <th scope="col">
            <span className="visually-hidden">{t('expenseTable.actions')}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td data-label={t('expenseTable.date')}>{formatDate(expense.expenseDate)}</td>
            <td data-label={t('expenseTable.category')}>{codeLabel('expenseCategory', expense.category)}</td>
            <td data-label={t('expenseTable.description')}>
              {expense.description}
              {expense.phaseName && <span className="muted"> · {expense.phaseName}</span>}
            </td>
            <td data-label={t('expenseTable.registeredBy')}>{expense.registeredBy ?? '—'}</td>
            <td data-label={t('expenseTable.amount')} className="data-table__number">
              {formatCurrency(expense.amount)}
            </td>
            <td data-label={t('expenseTable.actions')}>
              {onDelete && (
                <button
                  type="button"
                  className="button-secondary button-small"
                  disabled={busy}
                  onClick={() => onDelete(expense)}
                >
                  {t('expenseTable.delete')}
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
