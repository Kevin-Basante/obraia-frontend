import { buildQuery } from '../utils/query.js'
import { authorizedRequest } from './session.js'

// Measurements of the building elements of a project (/api/projects/{id}/measurements).

function measurementsPath(projectId, suffix = '') {
  return `/api/projects/${encodeURIComponent(projectId)}/measurements${suffix}`
}

export function listMeasurements(projectId, { floor, element } = {}, options) {
  return authorizedRequest(measurementsPath(projectId, buildQuery({ floor, element })), options)
}

export function createMeasurement(projectId, measurement) {
  return authorizedRequest(measurementsPath(projectId), { method: 'POST', body: measurement })
}

export function updateMeasurement(projectId, measurementId, measurement) {
  return authorizedRequest(measurementsPath(projectId, `/${encodeURIComponent(measurementId)}`), {
    method: 'PUT',
    body: measurement,
  })
}

export function deleteMeasurement(projectId, measurementId) {
  return authorizedRequest(measurementsPath(projectId, `/${encodeURIComponent(measurementId)}`), { method: 'DELETE' })
}

/** Manual totals against the AI ones, by element and floor. */
export function getMeasurementComparison(projectId, options) {
  return authorizedRequest(measurementsPath(projectId, '/comparison'), options)
}
