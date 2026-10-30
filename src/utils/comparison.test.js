import { describe, expect, it } from 'vitest'
import { comparisonLabel, formatDifference } from './comparison.js'

describe('comparison', () => {
  it('names each status of the backend', () => {
    expect(comparisonLabel('manual_only')).toBe('Manual only')
    expect(comparisonLabel('review')).toBe('Review')
  })

  it('writes the difference with its sign and a decimal comma', () => {
    expect(formatDifference(5)).toBe('+5%')
    expect(formatDifference('-20.00')).toBe('-20%')
    expect(formatDifference(2.55)).toBe('+2,55%')
    expect(formatDifference(0)).toBe('0%')
    expect(formatDifference(null)).toBe('—')
  })
})
