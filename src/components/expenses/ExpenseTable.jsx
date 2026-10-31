import { formatCurrency, formatDate } from '../../utils/format.js'
import '../catalog/DataTable.css'

/** Expenses of a project, newest first. `onDelete` is left out when the project is closed. */
export function ExpenseTable({ expenses, onDelete, busy }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th scope="col">Date</th>
          <th scope="col">Category</th>
          <th scope="col">Description</th>
          <th scope="col">Registered by</th>
          <th scope="col" className="data-table__number">
            Amount
          </th>
          <th scope="col">
            <span className="visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {expenses.map((expense) => (
          <tr key={expense.id}>
            <td data-label="Date">{formatDate(expense.expenseDate)}</td>
            <td data-label="Category">{expense.category.label}</td>
            <td data-label="Description">
              {expense.description}
              {expense.phaseName && <span className="muted"> · {expense.phaseName}</span>}
            </td>
            <td data-label="Registered by">{expense.registeredBy ?? '—'}</td>
            <td data-label="Amount" className="data-table__number">
              {formatCurrency(expense.amount)}
            </td>
            <td data-label="Actions">
              {onDelete && (
                <button
                  type="button"
                  className="button-secondary button-small"
                  disabled={busy}
                  onClick={() => onDelete(expense)}
                >
                  Delete
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
