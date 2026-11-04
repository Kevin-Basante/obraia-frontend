import { describe, expect, it } from 'vitest'
import { countUpValue, easeOutCubic } from './countUp.js'

describe('easeOutCubic', () => {
  it('starts at 0 and ends at 1', () => {
    expect(easeOutCubic(0)).toBe(0)
    expect(easeOutCubic(1)).toBe(1)
  })

  it('moves faster at the start than at the end', () => {
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5)
  })
})

describe('countUpValue', () => {
  it('rounds the value to whole units', () => {
    expect(countUpValue(1000, 0.5)).toBe(875)
  })

  it('keeps the progress between 0 and 1', () => {
    expect(countUpValue(1000, -1)).toBe(0)
    expect(countUpValue(1000, 2)).toBe(1000)
  })
})
