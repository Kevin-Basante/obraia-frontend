import { describe, expect, it } from 'vitest'
import { delayText, formatScore, sortFactors, triggerText } from './risk.js'

describe('risk helpers', () => {
  it('rounds the score to one decimal with a comma', () => {
    expect(formatScore(66.88)).toBe('66,9')
    expect(formatScore('100.00')).toBe('100')
    expect(formatScore(0)).toBe('0')
  })

  it('writes the expected delay', () => {
    expect(delayText(0)).toBe('No delay expected')
    expect(delayText(1)).toBe('About 1 day of delay expected')
    expect(delayText(12)).toBe('About 12 days of delay expected')
  })

  it('explains what started the assessment', () => {
    expect(triggerText('progress_report')).toBe('After a progress report')
    expect(triggerText('manual')).toBe('Requested by a member')
    expect(triggerText('unknown')).toBe('unknown')
  })

  it('puts the factor with the highest score first', () => {
    const factors = [
      { code: 'progress_pace', score: 20 },
      { code: 'budget_overrun', score: 75 },
      { code: 'schedule_delay', score: '40.00' },
    ]

    expect(sortFactors(factors).map((factor) => factor.code)).toEqual([
      'budget_overrun',
      'schedule_delay',
      'progress_pace',
    ])
    expect(factors[0].code).toBe('progress_pace')
  })
})
