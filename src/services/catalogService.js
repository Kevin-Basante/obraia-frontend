import { buildQuery } from '../utils/query.js'
import { apiGet } from './apiClient.js'

// Public catalogs of the backend (/api/catalogs/...). They do not need a session.

export function getProjectTypes(options) {
  return apiGet('/api/catalogs/project-types', options)
}

export function getProjectType(id, options) {
  return apiGet(`/api/catalogs/project-types/${encodeURIComponent(id)}`, options)
}

/** Standard phases. With `area` (m2) the backend picks the size; otherwise it uses `size`. */
export function getPhasePlan(id, { size, area } = {}, options) {
  return apiGet(`/api/catalogs/project-types/${encodeURIComponent(id)}/phases${buildQuery({ size, area })}`, options)
}

export function getMaterialFormulas(id, { element } = {}, options) {
  return apiGet(
    `/api/catalogs/project-types/${encodeURIComponent(id)}/material-formulas${buildQuery({ element })}`,
    options,
  )
}

export function getLocations({ department, search } = {}, options) {
  return apiGet(`/api/catalogs/locations${buildQuery({ department, search })}`, options)
}

export function getDepartments(options) {
  return apiGet('/api/catalogs/locations/departments', options)
}

export function getMaterialCategories(options) {
  return apiGet('/api/catalogs/material-categories', options)
}

export function getMaterials({ category, search } = {}, options) {
  return apiGet(`/api/catalogs/materials${buildQuery({ category, search })}`, options)
}
