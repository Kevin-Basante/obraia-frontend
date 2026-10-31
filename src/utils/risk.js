import { formatQuantity } from './format.js'

// Helpers for the risk assessments sent by the backend (score from 0 to 100).

const TRIGGER_TEXT = {
  manual: 'Requested by a member',
  expense: 'After an expense',
  progress_report: 'After a progress report',
  scheduled: 'Scheduled',
}

/** 66.88 -> "66,9". */
export function formatScore(score) {
  return formatQuantity(Math.round(Number(score) * 10) / 10)
}

/** 0 -> "No delay expected", 12 -> "About 12 days of delay expected". */
export function delayText(days) {
  if (days <= 0) return 'No delay expected'
  return `About ${days} ${days === 1 ? 'day' : 'days'} of delay expected`
}

/** What started an assessment, from the code of its trigger. */
export function triggerText(code) {
  return TRIGGER_TEXT[code] ?? code
}

/** The factors from the highest score to the lowest, so the main reason comes first. */
export function sortFactors(factors) {
  return [...factors].sort((a, b) => Number(b.score) - Number(a.score))
}
