import { describe, expect, it } from 'vitest'
import { greetingFor, longDate } from './greeting.js'

describe('greetingFor', () => {
  it('changes with the hour of the day', () => {
    expect(greetingFor(new Date(2026, 10, 4, 8))).toBe('Good morning')
    expect(greetingFor(new Date(2026, 10, 4, 12))).toBe('Good afternoon')
    expect(greetingFor(new Date(2026, 10, 4, 19))).toBe('Good evening')
  })
})

describe('longDate', () => {
  it('shows the weekday, month and day', () => {
    expect(longDate(new Date(2026, 10, 4))).toBe('Wednesday, November 4')
  })
})
