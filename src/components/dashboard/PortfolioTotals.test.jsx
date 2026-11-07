import { describe, expect, it } from 'vitest'
import { renderHtml, renderText } from '../../test/renderHtml.js'
import { PortfolioTotals } from './PortfolioTotals.jsx'

const portfolio = { projectCount: 3, active: 1, atRisk: 1, approvedBudget: 1000, totalSpent: 300, projects: [] }

describe('PortfolioTotals', () => {
  it('shows the totals of every project', () => {
    const text = renderText(<PortfolioTotals portfolio={portfolio} />)

    expect(text).toContain('Projects 3 1 in progress')
    expect(text).toContain('With high or critical risk')
    expect(text).toContain('of the approved budgets')
  })

  it('marks the spent tile when the budgets are passed', () => {
    const html = renderHtml(<PortfolioTotals portfolio={{ ...portfolio, totalSpent: 1500 }} />)

    expect(html).toContain('kpi-tile--bad')
  })

  it('has nothing to compare with when no budget is approved', () => {
    const text = renderText(<PortfolioTotals portfolio={{ ...portfolio, atRisk: 0, approvedBudget: 0 }} />)

    expect(text).toContain('No project with high risk')
    expect(text).toContain('No approved budget to compare with')
  })
})
