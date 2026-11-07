import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderHtml, renderText } from '../../test/renderHtml.js'
import { MoneyPanel } from './MoneyPanel.jsx'

const money = {
  approvedVersion: 1,
  budgetVersions: 2,
  approvedBudget: 1000,
  totalSpent: 300,
  remaining: 700,
  spentPct: 30,
  expenseCount: 3,
  byCategory: [
    { category: { code: 'materials', label: 'Materials' }, amount: 200 },
    { category: { code: 'labor', label: 'Labor' }, amount: 100 },
  ],
}

function render(changes = {}, html = false) {
  const element = (
    <MemoryRouter>
      <MoneyPanel projectId={4} money={{ ...money, ...changes }} />
    </MemoryRouter>
  )
  return html ? renderHtml(element) : renderText(element)
}

describe('MoneyPanel', () => {
  it('shows the approved version, the gauge and each category', () => {
    const text = render()

    expect(text).toContain('Version 1 approved · 2 versions quoted')
    expect(text).toContain('Remaining')
    expect(text).toContain('of the approved budget is spent')
    expect(text).toContain('Materials')
    expect(text).toContain('Labor')
  })

  it('links to the budget and the expenses of the project', () => {
    const html = render({}, true)

    expect(html).toContain('href="/projects/4/budgets"')
    expect(html).toContain('href="/projects/4/expenses"')
  })

  it('says how much is over the budget', () => {
    const html = render({ totalSpent: 1200, remaining: -200, spentPct: 120 }, true)

    expect(html).toContain('Over budget')
    expect(html).toContain('money-panel__gauge--over')
  })

  it('has no gauge without an approved budget', () => {
    const html = render(
      { approvedVersion: null, approvedBudget: null, remaining: null, spentPct: null, byCategory: [] },
      true,
    )

    expect(html).toContain('2 versions quoted, none approved')
    expect(html).not.toContain('money-panel__gauge')
    expect(html).toContain('No expenses registered yet.')
  })
})
