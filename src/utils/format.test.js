import { describe, expect, it } from 'vitest'
import { setLanguage } from '../i18n/i18n.js'
import {
  formatAmount,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatFileSize,
  formatPercent,
  formatQuantity,
} from './format.js'

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

  it('writes the date in Spanish when the site is in Spanish', () => {
    setLanguage('es')
    try {
      expect(formatDate('2026-10-04')).toBe('4 de oct de 2026')
    } finally {
      setLanguage('en')
    }
  })

  it('formats file sizes in B, KB and MB', () => {
    expect(formatFileSize(800)).toBe('800 B')
    expect(formatFileSize(49441)).toBe('48,3 KB')
    expect(formatFileSize(10 * 1024 * 1024)).toBe('10 MB')
  })

  it('writes the unit of an amount with its exponent', () => {
    expect(formatAmount(33.6, 'm2')).toBe('33,6 m²')
    expect(formatAmount('0.92', 'm3')).toBe('0,92 m³')
  })
})

describe('formatDateTime', () => {
  it('shows date and time in the time zone of the browser', () => {
    const expected = new Date('2026-10-30T04:47:34Z').toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })

    expect(formatDateTime('2026-10-30T04:47:34Z')).toBe(expected)
    expect(expected).toContain('2026')
  })
})
