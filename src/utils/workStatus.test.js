import { describe, expect, it } from 'vitest'
import { countReports, findTask, formatProgress, workActionLabel } from './workStatus.js'

const plan = {
  phases: [
    { id: 'f1', tasks: [{ id: 't1', reportCount: 2 }, { id: 't2', reportCount: 0 }] },
    { id: 'f2', tasks: [{ id: 't3', reportCount: 1 }] },
  ],
}

describe('work status', () => {
  it('names the button after the change it makes', () => {
    expect(workActionLabel('planned', 'in_progress')).toBe('Start')
    expect(workActionLabel('delayed', 'in_progress')).toBe('Resume')
    expect(workActionLabel('completed', 'in_progress')).toBe('Reopen')
    expect(workActionLabel('in_progress', 'delayed')).toBe('Mark as delayed')
    expect(workActionLabel('in_progress', 'completed')).toBe('Complete')
  })

  it('formats progress from 0 to 100 as a percentage', () => {
    expect(formatProgress(40)).toBe('40%')
    expect(formatProgress('13.33')).toBe('13,3%')
    expect(formatProgress(0)).toBe('0%')
  })

  it('counts the reports of every task', () => {
    expect(countReports(plan)).toBe(3)
    expect(countReports({ phases: [] })).toBe(0)
  })

  it('finds a task with its phase', () => {
    expect(findTask(plan, 't3')).toEqual({ phase: plan.phases[1], task: plan.phases[1].tasks[0] })
    expect(findTask(plan, 'nope')).toBeNull()
  })
})
