import { describe, expect, it } from 'vitest'
import { parsePercentage, toProgressRequest, todayIso, validateProgress } from './progressForm.js'

const form = { completionPercentage: '40', reportDate: '', notes: '', fromSiteManager: false }

describe('progress form', () => {
  it('reads percentages with a decimal comma or point', () => {
    expect(parsePercentage('40')).toBe(40)
    expect(parsePercentage(' 37,5 ')).toBe(37.5)
    expect(parsePercentage('99.25')).toBe(99.25)
    expect(parsePercentage('100')).toBe(100)
  })

  it('rejects percentages out of range or badly written', () => {
    expect(parsePercentage('100,5')).toBeNull()
    expect(parsePercentage('-5')).toBeNull()
    expect(parsePercentage('40,123')).toBeNull()
    expect(parsePercentage('')).toBeNull()
  })

  it('writes today as YYYY-MM-DD in local time', () => {
    expect(todayIso(new Date(2026, 9, 31, 23, 50))).toBe('2026-10-31')
  })

  it('rejects a future date', () => {
    expect(validateProgress({ ...form, reportDate: '2026-11-01' }, '2026-10-31')).toEqual({
      reportDate: 'The date cannot be in the future',
    })
    expect(validateProgress({ ...form, reportDate: '2026-10-31' }, '2026-10-31')).toEqual({})
  })

  it('needs a valid percentage and short notes', () => {
    expect(validateProgress({ ...form, completionPercentage: 'abc', notes: 'x'.repeat(1001) })).toEqual({
      completionPercentage: 'Enter a number from 0 to 100, with up to 2 decimals',
      notes: 'Use at most 1000 characters',
    })
  })

  it('sends empty fields as null', () => {
    expect(toProgressRequest({ ...form, completionPercentage: '37,5', notes: '  Llovió  ' })).toEqual({
      completionPercentage: 37.5,
      reportDate: null,
      notes: 'Llovió',
      fromSiteManager: false,
    })
  })
})
