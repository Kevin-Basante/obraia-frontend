import { formatDate } from './format.js'

// Helpers for the dashboards. Percentages come from the backend from 0 to 100.

/** "5 of 22 tasks done", or a hint while the plan has no tasks. */
export function tasksDoneText(work) {
  if (work.taskCount === 0) return 'No tasks yet'
  return `${work.completedTasks} of ${work.taskCount} ${work.taskCount === 1 ? 'task' : 'tasks'} done`
}

/** 0 -> "No late tasks", 1 -> "1 late task", 7 -> "7 late tasks". */
export function lateTasksText(count) {
  if (count === 0) return 'No late tasks'
  return `${count} late ${count === 1 ? 'task' : 'tasks'}`
}

/** "Ends Jan 30, 2027", or a hint while the plan has no dates. */
export function planEndText(work) {
  return work.plannedEndDate ? `Ends ${formatDate(work.plannedEndDate)}` : 'The plan has no dates yet'
}

/**
 * Where the money stands: `level` is "none" without an approved budget,
 * "over" when the expenses passed it, "near" from 90% and "ok" below.
 */
export function moneyLevel(money) {
  if (money.approvedBudget === null) return 'none'
  const spent = Number(money.spentPct)
  if (spent > 100) return 'over'
  if (spent >= 90) return 'near'
  return 'ok'
}

/** Tone of a tile from the risk level: low is fine, medium needs attention, high and critical are a problem. */
export function riskTone(risk) {
  if (!risk) return 'neutral'
  if (risk.level.code === 'low') return 'ok'
  if (risk.level.code === 'medium') return 'warn'
  return 'bad'
}

/** Tone of a tile from the money level. */
export function moneyTone(money) {
  return { none: 'neutral', ok: 'ok', near: 'warn', over: 'bad' }[moneyLevel(money)]
}

/** Width of a bar, from 0 to 100, for a value that can pass 100 or be missing. */
export function barWidth(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 0
  return Math.min(100, Math.max(0, number))
}

/** "Sep 1 to Sep 5, 2026"-like range, or null without dates. */
export function shortRange(start, end) {
  if (!start && !end) return null
  return `${start ? formatDate(start) : '—'} to ${end ? formatDate(end) : '—'}`
}
