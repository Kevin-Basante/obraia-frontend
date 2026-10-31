import { describe, expect, it } from 'vitest'
import {
  approvedVersion,
  daysSourceText,
  formatRate,
  isNothingToQuote,
  materialsTotal,
  shareOfTotal,
} from './budget.js'

describe('budget helpers', () => {
  it('recognizes the errors of a project with nothing to quote', () => {
    expect(isNothingToQuote({ code: 'NO_MEASUREMENTS' })).toBe(true)
    expect(isNothingToQuote({ code: 'NO_MATERIAL_FORMULAS' })).toBe(true)
    expect(isNothingToQuote({ code: 'PROJECT_CLOSED' })).toBe(false)
    expect(isNothingToQuote(null)).toBe(false)
  })

  it('shows the rate only for percentage rows', () => {
    expect(formatRate(3)).toBe('3%')
    expect(formatRate('19.00')).toBe('19%')
    expect(formatRate(null)).toBe('')
  })

  it('computes the share of a row in the total', () => {
    expect(shareOfTotal(25, 100)).toBe(0.25)
    expect(shareOfTotal(10, 0)).toBe(0)
  })

  it('explains where the working days come from', () => {
    expect(daysSourceText('phases')).toContain('dates of the phases')
    expect(daysSourceText('standard_plan')).toContain('standard phases')
  })

  it('finds the approved version', () => {
    const versions = [
      { id: 'b2', status: { code: 'draft' } },
      { id: 'b1', status: { code: 'approved' } },
    ]

    expect(approvedVersion(versions).id).toBe('b1')
    expect(approvedVersion([versions[0]])).toBeUndefined()
  })

  it('adds up the subtotals of the materials', () => {
    expect(materialsTotal([{ subtotal: 1000.5 }, { subtotal: '2000' }])).toBe(3000.5)
    expect(materialsTotal([])).toBe(0)
  })
})
