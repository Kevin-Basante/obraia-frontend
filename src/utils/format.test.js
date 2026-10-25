import { describe, expect, it } from 'vitest'
import { formatCurrency, formatDate, formatPercent, formatQuantity } from './format.js'

// Intl puts a non-breaking space after the currency symbol; tests compare with a normal space.
const plain = (text) => text.replace(/\s/g, ' ')

describe('format', () => {
  it('formats prices in Colombian pesos without decimals', () => {
    expect(plain(formatCurrency(33000))).toBe('$ 33.000')
    expect(plain(formatCurrency('100000.00'))).toBe('$ 100.000')
  })

  it('formats quantities with a decimal comma', () => {
    expect(formatQuantity(12.5)).toBe('12,5')
    expect(formatQuantity('0.0200')).toBe('0,02')
  })

  it('formats the waste factor as a percentage', () => {
    expect(formatPercent(0.05)).toBe('5%')
  })

  it('formats a date without moving it to another day', () => {
    expect(formatDate('2026-10-04')).toBe('Oct 4, 2026')
  })
})
