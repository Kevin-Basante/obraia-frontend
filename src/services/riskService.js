import { authorizedRequest } from './session.js'

// Risk of delay and of going over budget (/api/projects/{id}/risk).

function riskPath(projectId, suffix = '') {
  return `/api/projects/${encodeURIComponent(projectId)}/risk${suffix}`
}

/** The latest assessment (null before the first one) and the history of the score. */
export function getRiskOverview(projectId, options) {
  return authorizedRequest(riskPath(projectId), options)
}

/** Asks for a new assessment now. */
export function assessRisk(projectId) {
  return authorizedRequest(riskPath(projectId, '/assess'), { method: 'POST' })
}
