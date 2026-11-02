import { apiPost } from './apiClient.js'
import { authorizedRequest } from './session.js'

// Deleting the account takes two steps, like a project: ask for it with the
// password and confirm it from the email.

/** What the user loses: { ownProjects, sharedProjects, joinedProjects, purgeDate, linkValidMinutes }. */
export function getAccountDeletionImpact(options) {
  return authorizedRequest('/api/users/me/deletion-impact', options)
}

/** The backend checks the password and sends the confirmation link by email. */
export function requestAccountDeletion(password) {
  return authorizedRequest('/api/users/me/deletion-request', { method: 'POST', body: { password } })
}

/** Public: the token from the email is enough, so it works without a session. */
export function confirmAccountDeletion(token) {
  return apiPost('/api/users/deletion/confirm', { token })
}
