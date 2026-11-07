import { authorizedRequest } from './session.js'

// Summaries for the dashboards (/api/dashboard): one request per screen.

/** Every project of the user with its progress, money and risk, and the totals of all of them. */
export function getPortfolio(options) {
  return authorizedRequest('/api/dashboard', options)
}

/** Plan, next tasks, budget against expenses, latest risk and counts of one project. */
export function getProjectOverview(projectId, options) {
  return authorizedRequest(`/api/dashboard/projects/${encodeURIComponent(projectId)}`, options)
}
