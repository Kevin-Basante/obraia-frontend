// Rules of a progress report, checked before sending the form.

export const EMPTY_PROGRESS_FORM = { completionPercentage: '', reportDate: '', notes: '', fromSiteManager: false }

const PERCENT_PATTERN = /^\d{1,3}([.,]\d{1,2})?$/

/** "40" or "37,5" -> number from 0 to 100, or null if it is not valid. */
export function parsePercentage(text) {
  const normalized = text.trim()
  if (!PERCENT_PATTERN.test(normalized)) return null
  const value = Number(normalized.replace(',', '.'))
  return value <= 100 ? value : null
}

/** Today in the browser as "YYYY-MM-DD", the limit of the report date. */
export function todayIso(now = new Date()) {
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/** Returns one message per invalid field (empty if the form is valid). */
export function validateProgress(form, today = todayIso()) {
  const errors = {}
  if (parsePercentage(form.completionPercentage) === null) {
    errors.completionPercentage = 'Enter a number from 0 to 100, with up to 2 decimals'
  }
  if (form.reportDate && form.reportDate > today) errors.reportDate = 'The date cannot be in the future'
  if (form.notes.trim().length > 1000) errors.notes = 'Use at most 1000 characters'
  return errors
}

/** Body that the backend expects. Without a date the backend uses today. */
export function toProgressRequest(form) {
  return {
    completionPercentage: parsePercentage(form.completionPercentage),
    reportDate: form.reportDate || null,
    notes: form.notes.trim() || null,
    fromSiteManager: form.fromSiteManager,
  }
}
