import { apiPost, apiRequest } from './apiClient.js'
import { authorizedRequest } from './session.js'

// PDF reports of a project (/api/projects/{id}/reports) and their public links.

function reportsPath(projectId, suffix) {
  return `/api/projects/${encodeURIComponent(projectId)}/reports${suffix}`
}

/** The PDF as a Blob. `type` is "public" or "full"; `lang` is the language of the report. */
export function downloadReport(projectId, type, lang) {
  return authorizedRequest(reportsPath(projectId, `/${type}?lang=${encodeURIComponent(lang)}`), {
    responseType: 'blob',
  })
}

/** Where the user stands with the full report: { status, requestedAt, downloadUntil }. */
export function getFullReportAccess(projectId, options) {
  return authorizedRequest(reportsPath(projectId, '/full/access'), options)
}

/** Asks the creator of the project, by email, to approve the full report. */
export function requestFullReport(projectId) {
  return authorizedRequest(reportsPath(projectId, '/full/requests'), { method: 'POST' })
}

/** A link that opens the public report without an account: { url, expiresAt }. */
export function shareReport(projectId) {
  return authorizedRequest(reportsPath(projectId, '/share'), { method: 'POST' })
}

/** Public: the creator approves with the token of the email. */
export function approveReport(token) {
  return apiPost('/api/reports/approve', { token })
}

/** Public: the public report of a shared link, as a Blob. */
export function downloadSharedReport(token, lang) {
  return apiRequest('/api/reports/shared', { method: 'POST', body: { token, lang }, responseType: 'blob' })
}

/** Wakes the AI service in the background; the answer says whether it is configured. */
export function wakeAi(options) {
  return authorizedRequest('/api/ai/wake', options)
}
