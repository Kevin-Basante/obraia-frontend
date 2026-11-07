import { describe, expect, it } from 'vitest'
import { renderHtml, renderText } from '../../test/renderHtml.js'
import { ProjectKpis } from './ProjectKpis.jsx'

const work = {
  progressPct: 36.4,
  plannedStartDate: '2026-09-01',
  plannedEndDate: '2027-01-30',
  phaseCount: 8,
  completedPhases: 2,
  taskCount: 22,
  completedTasks: 5,
  lateTasks: 7,
  currentPhase: 'Foundation',
  phases: [],
  upcomingTasks: [],
}

const money = {
  approvedVersion: 1,
  budgetVersions: 2,
  approvedBudget: 1000,
  totalSpent: 300,
  remaining: 700,
  spentPct: 30,
  expenseCount: 3,
  byCategory: [],
}

const counts = { blueprints: 1, manualMeasurements: 7, aiMeasurements: 1, members: 2 }

function overview(changes = {}) {
  return { projectId: 1, work, money, risk: null, counts, ...changes }
}

describe('ProjectKpis', () => {
  it('shows the five key numbers of the project', () => {
    const text = renderText(<ProjectKpis overview={overview()} />)

    expect(text).toContain('Progress')
    expect(text).toContain('5 of 22 tasks done')
    expect(text).toContain('spent')
    expect(text).toContain('Not assessed')
    expect(text).toContain('Foundation')
    expect(text).toContain('8 measurements')
    expect(text).toContain('1 by AI · 1 blueprint · 2 members')
  })

  it('shows the score and the level of the latest risk assessment', () => {
    const risk = {
      level: { code: 'high', label: 'High' },
      score: 69.5,
      predictedDelayDays: 38,
      assessedAt: '2026-11-07T10:00:00Z',
    }
    const text = renderText(<ProjectKpis overview={overview({ risk })} />)

    expect(text).toContain('69,5 / 100')
    expect(text).toContain('About 38 days of delay expected')
  })

  it('says the budget is not approved and draws no bar for it', () => {
    const none = { ...money, approvedVersion: null, approvedBudget: null, remaining: null, spentPct: null }
    const html = renderHtml(<ProjectKpis overview={overview({ money: none })} />)

    expect(html).toContain('Not approved')
    expect(html).not.toContain('Approved budget spent')
  })

  it('says when there is no plan yet', () => {
    const empty = { ...work, phaseCount: 0, taskCount: 0, completedTasks: 0, lateTasks: 0, currentPhase: null }
    const text = renderText(<ProjectKpis overview={overview({ work: empty })} />)

    expect(text).toContain('No plan yet')
  })
})
