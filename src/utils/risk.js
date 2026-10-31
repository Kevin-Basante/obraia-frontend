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

/**
 * Places each point of the history in a chart of `width` × `height`: the
 * oldest on the left, score 100 at the top and 0 at the bottom. A single
 * point goes in the middle.
 */
export function chartPoints(history, width, height) {
  const step = history.length > 1 ? width / (history.length - 1) : 0
  return history.map((point, index) => ({
    ...point,
    x: history.length > 1 ? Math.round(index * step * 10) / 10 : width / 2,
    y: Math.round((height - (Number(point.score) / 100) * height) * 10) / 10,
  }))
}

/** The factors from the highest score to the lowest, so the main reason comes first. */
export function sortFactors(factors) {
  return [...factors].sort((a, b) => Number(b.score) - Number(a.score))
}
