import { apiPost } from './apiClient.js'
import { authorizedRequest } from './session.js'

// Deleting a project takes two steps: ask for it and confirm it from the email.

/** What the project holds: { projectName, content, purgeDate, linkValidMinutes }. */
export function getDeletionImpact(projectId, options) {
  return authorizedRequest(`/api/projects/${encodeURIComponent(projectId)}/deletion-impact`, options)
}

/** Only the creator can ask for it. The backend sends the confirmation link by email. */
export function requestDeletion(projectId) {
  return authorizedRequest(`/api/projects/${encodeURIComponent(projectId)}/deletion-request`, { method: 'POST' })
}

/** Public: the token from the email is enough, so it works without a session. */
export function confirmDeletion(token) {
  return apiPost('/api/projects/deletion/confirm', { token })
}
