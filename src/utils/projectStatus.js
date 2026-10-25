// Statuses of a project, in the order of its life cycle. The backend sends
// the label too; this list is only for the filter of the project list.
export const PROJECT_STATUSES = [
  { value: 'draft', label: 'Draft' },
  { value: 'planned', label: 'Planned' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'paused', label: 'Paused' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
]

// Text of the button that moves a project to each status.
const ACTION_LABELS = {
  draft: 'Back to draft',
  planned: 'Mark as planned',
  in_progress: 'Start work',
  paused: 'Pause',
  completed: 'Mark as completed',
  cancelled: 'Cancel project',
}

export function statusActionLabel(code) {
  return ACTION_LABELS[code] ?? code
}

/** Completed and cancelled projects can no longer change. */
export function isClosed(project) {
  return project.nextStatuses.length === 0
}

/** Completing or cancelling closes the project for good, so the page asks first. */
export function needsConfirmation(code) {
  return code === 'cancelled' || code === 'completed'
}
