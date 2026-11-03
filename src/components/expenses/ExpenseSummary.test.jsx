import { describe, expect, it } from 'vitest'
import { renderHtml, renderText } from '../../test/renderHtml.js'
import { ExpenseSummary } from './ExpenseSummary.jsx'

const category = { code: 'materials', label: 'Materials' }

function summary(overrides) {
  return {
    totalSpent: 400000,
    approvedBudget: 1000000,
    remaining: 600000,
    spentPct: 40,
    byCategory: [{ category, count: 2, amount: 400000 }],
    ...overrides,
  }
}

describe('ExpenseSummary', () => {
  it('shows what remains of the approved budget', () => {
    const text = renderText(<ExpenseSummary summary={summary()} />)

    expect(text).toContain('Remaining')
    expect(renderHtml(<ExpenseSummary summary={summary()} />)).toContain('role="progressbar"')
    expect(text).toContain('Materials 2')
  })

  it('tells in words when the budget was passed', () => {
    const text = renderText(<ExpenseSummary summary={summary({ remaining: -200000, spentPct: 120 })} />)

    expect(text).toContain('Over budget')
    expect(text).toContain('of the approved budget is spent')
  })

  it('shows only the totals without an approved budget', () => {
    const text = renderText(<ExpenseSummary summary={summary({ approvedBudget: null, remaining: null, byCategory: [] })} />)

    expect(text).toContain('Not approved yet')
    expect(text).not.toContain('Remaining')
    expect(text).not.toContain('Category')
  })
})
