import { afterEach, describe, expect, it } from 'vitest'
import { setLanguage } from '../i18n/i18n.js'
import { budgetItemText } from './budgetText.js'

describe('budgetItemText', () => {
  afterEach(() => setLanguage('en'))

  it('writes the description of a row with its values', () => {
    setLanguage('es')
    expect(budgetItemText({ itemType: 'transport', description: 'x', params: { city: 'Pasto' } })).toBe(
      'Transporte de los materiales a la obra en Pasto',
    )
    expect(budgetItemText({ itemType: 'labor', description: 'x', params: { days: '10', rate: '280000' } })).toMatch(
      /^Cuadrilla por 10 días hábiles a \$\s280\.000 por día$/,
    )
    expect(budgetItemText({ itemType: 'waste', description: 'x', params: null })).toBe(
      'Material extra por roturas y cortes',
    )
  })

  it('keeps the description of rows without values or of unknown layers', () => {
    expect(budgetItemText({ itemType: 'materials', description: 'Old text', params: null })).toBe('Old text')
    expect(budgetItemText({ itemType: 'contingency', description: 'Reserve', params: null })).toBe('Reserve')
  })
})
