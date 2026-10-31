import { authorizedRequest } from './session.js'

// Quotation and budget versions of a project (/api/projects/{id}/budgets).

function budgetsPath(projectId, suffix = '') {
  return `/api/projects/${encodeURIComponent(projectId)}/budgets${suffix}`
}

/** Budget versions, newest first. Empty until the first quotation is saved. */
export function listBudgets(projectId, options) {
  return authorizedRequest(budgetsPath(projectId), options)
}

/** Quotes the project without saving: cost layers, materials and the data used. */
export function getQuotationPreview(projectId, options) {
  return authorizedRequest(budgetsPath(projectId, '/preview'), options)
}

/** Quotes the project and saves it as a new draft version. */
export function createBudget(projectId) {
  return authorizedRequest(budgetsPath(projectId), { method: 'POST' })
}

/** A budget version with its rows. */
export function getBudget(projectId, budgetId, options) {
  return authorizedRequest(budgetsPath(projectId, `/${encodeURIComponent(budgetId)}`), options)
}
