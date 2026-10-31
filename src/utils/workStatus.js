import { formatPercent } from './format.js'

// Statuses of phases and tasks: planned, in_progress, delayed and completed.
// The backend sends which ones each phase or task can move to.

/** Text of the button that moves a phase or task from `current` to `next`. */
export function workActionLabel(current, next) {
  if (next === 'in_progress') {
    if (current === 'planned') return 'Start'
    if (current === 'delayed') return 'Resume'
    return 'Reopen'
  }
  if (next === 'delayed') return 'Mark as delayed'
  if (next === 'completed') return 'Complete'
  return next
}

/** 40 -> "40%", 13.33 -> "13,3%". The backend sends progress from 0 to 100. */
export function formatProgress(value) {
  return formatPercent(Number(value) / 100)
}

/** Number of progress reports in the whole plan: while there are none, the plan can be deleted. */
export function countReports(plan) {
  return plan.phases.reduce(
    (total, phase) => total + phase.tasks.reduce((sum, task) => sum + task.reportCount, 0),
    0,
  )
}

/** The task with that id and its phase, or null if it is not in the plan. */
export function findTask(plan, taskId) {
  for (const phase of plan.phases) {
    const task = phase.tasks.find((item) => item.id === taskId)
    if (task) return { phase, task }
  }
  return null
}
