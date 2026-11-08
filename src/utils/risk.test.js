import { afterEach, describe, expect, it } from 'vitest'
import { setLanguage } from '../i18n/i18n.js'
import {
  chartPoints,
  delayText,
  factorDetail,
  factorLabel,
  formatScore,
  riskDetailText,
  sortFactors,
  triggerText,
} from './risk.js'

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

  it('spreads the history over the width of the chart', () => {
    const points = chartPoints([{ score: 0 }, { score: '50.00' }, { score: 100 }], 200, 100)

    expect(points.map(({ x, y }) => [x, y])).toEqual([
      [0, 100],
      [100, 50],
      [200, 0],
    ])
  })

  it('puts a single point in the middle', () => {
    expect(chartPoints([{ score: 25 }], 200, 100)).toEqual([{ score: 25, x: 100, y: 75 }])
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

  describe('sentences of the factors', () => {
    afterEach(() => setLanguage('en'))

    it('names each rule in the current language', () => {
      setLanguage('es')
      expect(factorLabel({ code: 'schedule_delay', label: 'Late tasks' })).toBe('Tareas atrasadas')
      expect(factorLabel({ code: 'new_rule', label: 'New rule' })).toBe('New rule')
    })

    it('builds the detail from its code and values', () => {
      expect(riskDetailText('time_vs_progress', { elapsed: '50', progress: '30' })).toBe(
        '50% of the planned time passed with 30% of the work done',
      )
      expect(riskDetailText('late_tasks', { count: '2', task: 'Muros', days: '1' })).toBe(
        '2 tasks are past their planned end; "Muros" is 1 day late',
      )
      setLanguage('es')
      expect(riskDetailText('late_tasks', { count: '1', task: 'Muros', days: '6' })).toBe(
        '1 tarea pasó su fecha de fin planeada; "Muros" lleva 6 días de atraso',
      )
    })

    it('keeps the English detail of factors saved without a code', () => {
      expect(factorDetail({ detail: 'Old sentence', detailCode: null })).toBe('Old sentence')
      expect(factorDetail({ detail: 'x', detailCode: 'no_budget', detailParams: {} })).toBe(
        'There is no approved budget yet',
      )
    })
  })
})
