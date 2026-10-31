import { authorizedRequest } from './session.js'

// Money really spent on a project (/api/projects/{id}/expenses).

function expensesPath(projectId, suffix = '') {
  return `/api/projects/${encodeURIComponent(projectId)}/expenses${suffix}`
}

/** Expenses of the project, newest first. */
export function listExpenses(projectId, options) {
  return authorizedRequest(expensesPath(projectId), options)
}

/** Total spent by category, compared with the approved budget. */
export function getExpenseSummary(projectId, options) {
  return authorizedRequest(expensesPath(projectId, '/summary'), options)
}

/** Registers an expense; the approved budget takes the new total spent. */
export function createExpense(projectId, expense) {
  return authorizedRequest(expensesPath(projectId), { method: 'POST', body: expense })
}

/** Deletes an expense registered by mistake. */
export function deleteExpense(projectId, expenseId) {
  return authorizedRequest(expensesPath(projectId, `/${encodeURIComponent(expenseId)}`), { method: 'DELETE' })
}
