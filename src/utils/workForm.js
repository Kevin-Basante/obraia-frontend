import { t } from '../i18n/i18n.js'
// Same rules as the backend for phases and tasks, checked before sending the form.

export const EMPTY_TASK_FORM = { phaseId: '', name: '', plannedStartDate: '', plannedEndDate: '' }

function checkDates(form, errors) {
  if (form.plannedStartDate && form.plannedEndDate && form.plannedEndDate < form.plannedStartDate) {
    errors.plannedEndDate = t('workForm.theEndCannotBeBefore')
  }
}

/** Returns one message per invalid field (empty if the form is valid). */
export function validatePhase(form) {
  const errors = {}
  const name = form.name.trim()
  if (name.length < 3 || name.length > 100) errors.name = t('workForm.use3To100Characters')
  checkDates(form, errors)
  return errors
}

export function validateTask(form) {
  const errors = {}
  if (!form.phaseId) errors.phaseId = t('workForm.chooseThePhase')
  const name = form.name.trim()
  if (name.length < 3 || name.length > 150) errors.name = t('workForm.use3To150Characters')
  checkDates(form, errors)
  return errors
}

/** Body that the backend expects for a phase. Empty dates are sent as null. */
export function toPhaseRequest(form) {
  return {
    name: form.name.trim(),
    plannedStartDate: form.plannedStartDate || null,
    plannedEndDate: form.plannedEndDate || null,
  }
}

export function toTaskRequest(form) {
  return { phaseId: form.phaseId, ...toPhaseRequest(form) }
}

/** Fills the form to edit a phase or task from the backend. */
export function toWorkForm(item) {
  return {
    phaseId: item.phaseId ?? '',
    name: item.name,
    plannedStartDate: item.plannedStartDate ?? '',
    plannedEndDate: item.plannedEndDate ?? '',
  }
}

/**
 * The backend reports the date order of a request under "plannedDatesInOrder";
 * the form shows it under the end date.
 */
export function workFieldErrors(fields) {
  if (!fields?.plannedDatesInOrder) return fields ?? {}
  const { plannedDatesInOrder, ...rest } = fields
  return { ...rest, plannedEndDate: plannedDatesInOrder }
}
