import { codeText, hasText, t } from '../i18n/i18n.js'
// Statuses of a project, in the order of its life cycle. The backend sends
// the label too; this list is only for the filter of the project list.
export const PROJECT_STATUSES = ['draft', 'planned', 'in_progress', 'paused', 'completed', 'cancelled']

/** Options of the status filter, in the current language. */
export function projectStatusOptions() {
  return PROJECT_STATUSES.map((code) => ({ value: code, label: codeText('status', code) }))
}

/** Text of the button that moves a project to each status. */
export function statusActionLabel(code) {
  return hasText(`projectStatus.actions.${code}`) ? t(`projectStatus.actions.${code}`) : code
}

/** Completed and cancelled projects can no longer change. */
export function isClosed(project) {
  return project.nextStatuses.length === 0
}

/** Completing or cancelling closes the project for good, so the page asks first. */
export function needsConfirmation(code) {
  return code === 'cancelled' || code === 'completed'
}
