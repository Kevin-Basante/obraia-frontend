import { describe, expect, it } from 'vitest'
import { renderText } from '../../test/renderHtml.js'
import { RiskFactorTable } from './RiskFactorTable.jsx'

const factors = [
  { code: 'budget_overrun', label: 'Budget overrun', detail: 'On budget', weight: 0.25, score: 10, delayDays: 0 },
  { code: 'schedule_delay', label: 'Schedule delay', detail: '2 tasks late', weight: 0.35, score: 62.5, delayDays: 12 },
]

describe('RiskFactorTable', () => {
  it('lists the highest score first', () => {
    const text = renderText(<RiskFactorTable factors={factors} />)

    expect(text.indexOf('Schedule delay')).toBeLessThan(text.indexOf('Budget overrun'))
  })

  it('shows the delay in days or a dash', () => {
    const text = renderText(<RiskFactorTable factors={factors} />)

    expect(text).toContain('12 d')
    expect(text).toContain('—')
  })
})
