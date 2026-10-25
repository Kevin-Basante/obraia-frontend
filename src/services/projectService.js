import { buildQuery } from '../utils/query.js'
import { authorizedRequest } from './session.js'

// Projects of the signed-in user (/api/projects). Only members can see a project.

function projectPath(id, suffix = '') {
  return `/api/projects/${encodeURIComponent(id)}${suffix}`
}

export function listProjects({ status, search } = {}, options) {
  return authorizedRequest(`/api/projects${buildQuery({ status, search })}`, options)
}

export function getProject(id, options) {
  return authorizedRequest(projectPath(id), options)
}

export function createProject(project) {
  return authorizedRequest('/api/projects', { method: 'POST', body: project })
}

export function updateProject(id, project) {
  return authorizedRequest(projectPath(id), { method: 'PUT', body: project })
}

/** `status` is a code from `nextStatuses`, for example "in_progress". */
export function changeProjectStatus(id, status) {
  return authorizedRequest(projectPath(id, '/status'), { method: 'PATCH', body: { status } })
}

export function assignSiteManager(id, siteManagerId) {
  return authorizedRequest(projectPath(id, '/site-manager'), { method: 'PUT', body: { siteManagerId } })
}

export function unassignSiteManager(id) {
  return authorizedRequest(projectPath(id, '/site-manager'), { method: 'DELETE' })
}
