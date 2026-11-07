import { describe, expect, it } from 'vitest'
import {
  barWidth,
  lateTasksText,
  moneyLevel,
  moneyTone,
  planEndText,
  riskTone,
  shortRange,
  tasksDoneText,
} from './dashboard.js'

const money = (overrides) => ({ approvedBudget: 1000, spentPct: 40, ...overrides })

describe('dashboard helpers', () => {
  it('counts the tasks done', () => {
    expect(tasksDoneText({ taskCount: 22, completedTasks: 5 })).toBe('5 of 22 tasks done')
    expect(tasksDoneText({ taskCount: 1, completedTasks: 0 })).toBe('0 of 1 task done')
    expect(tasksDoneText({ taskCount: 0, completedTasks: 0 })).toBe('No tasks yet')
  })

  it('tells how many tasks are late', () => {
    expect(lateTasksText(0)).toBe('No late tasks')
    expect(lateTasksText(1)).toBe('1 late task')
    expect(lateTasksText(7)).toBe('7 late tasks')
  })

  it('tells when the plan ends', () => {
    expect(planEndText({ plannedEndDate: '2027-01-30' })).toBe('Ends Jan 30, 2027')
    expect(planEndText({ plannedEndDate: null })).toBe('The plan has no dates yet')
  })

  it('reads where the money stands', () => {
    expect(moneyLevel(money({ approvedBudget: null, spentPct: null }))).toBe('none')
    expect(moneyLevel(money())).toBe('ok')
    expect(moneyLevel(money({ spentPct: 95 }))).toBe('near')
    expect(moneyLevel(money({ spentPct: 104.2 }))).toBe('over')
    expect(moneyTone(money({ spentPct: 104.2 }))).toBe('bad')
    expect(moneyTone(money({ approvedBudget: null }))).toBe('neutral')
  })

  it('colors the risk by its level', () => {
    expect(riskTone(null)).toBe('neutral')
    expect(riskTone({ level: { code: 'low' } })).toBe('ok')
    expect(riskTone({ level: { code: 'medium' } })).toBe('warn')
    expect(riskTone({ level: { code: 'critical' } })).toBe('bad')
  })

  it('keeps a bar between 0 and 100', () => {
    expect(barWidth(36.36)).toBe(36.36)
    expect(barWidth(140)).toBe(100)
    expect(barWidth(-3)).toBe(0)
    expect(barWidth(null)).toBe(0)
    expect(barWidth(undefined)).toBe(0)
  })

  it('writes a range of dates', () => {
    expect(shortRange('2026-09-01', '2026-09-05')).toBe('Sep 1, 2026 to Sep 5, 2026')
    expect(shortRange(null, '2026-09-05')).toBe('— to Sep 5, 2026')
    expect(shortRange(null, null)).toBeNull()
  })
})
