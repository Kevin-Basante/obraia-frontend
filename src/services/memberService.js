import { authorizedRequest } from './session.js'

// People who manage a project together (/api/projects/{id}/members).

function membersPath(projectId) {
  return `/api/projects/${encodeURIComponent(projectId)}/members`
}

export function listMembers(projectId, options) {
  return authorizedRequest(membersPath(projectId), options)
}

/** Adds a registered user with a verified account. */
export function addMember(projectId, email) {
  return authorizedRequest(membersPath(projectId), { method: 'POST', body: { email } })
}

export function removeMember(projectId, userId) {
  return authorizedRequest(`${membersPath(projectId)}/${encodeURIComponent(userId)}`, { method: 'DELETE' })
}
