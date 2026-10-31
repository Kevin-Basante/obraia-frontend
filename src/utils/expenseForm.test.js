import { describe, expect, it } from 'vitest'
import { parseMoney, toExpenseRequest, validateExpense } from './expenseForm.js'

const form = { category: 'materials', description: ' Cemento gris x 20 ', amount: '650.000', expenseDate: '', phaseId: '' }

describe('expense form', () => {
  it('reads amounts written in the Colombian way or plain', () => {
    expect(parseMoney('650.000')).toBe(650000)
    expect(parseMoney('$ 1.250.000,50')).toBe(1250000.5)
    expect(parseMoney('650000')).toBe(650000)
    expect(parseMoney('99,9')).toBe(99.9)
    expect(parseMoney('12.50')).toBe(12.5)
  })

  it('rejects zero, negative, too big or badly written amounts', () => {
    expect(parseMoney('0')).toBeNull()
    expect(parseMoney('-5')).toBeNull()
    expect(parseMoney('65.00.0')).toBeNull()
    expect(parseMoney('1.000.000.000.000')).toBeNull()
    expect(parseMoney('')).toBeNull()
  })

  it('accepts a complete form', () => {
    expect(validateExpense(form, '2026-10-31')).toEqual({})
  })

  it('explains each missing or invalid field', () => {
    expect(
      validateExpense({ ...form, category: '', description: '  ', amount: '0', expenseDate: '2026-11-01' }, '2026-10-31'),
    ).toEqual({
      category: 'Choose the category',
      description: 'Write what the money was spent on',
      amount: 'Enter an amount greater than 0, like 650.000',
      expenseDate: 'The date cannot be in the future',
    })
  })

  it('builds the request with nulls for the optional fields', () => {
    expect(toExpenseRequest(form)).toEqual({
      category: 'materials',
      description: 'Cemento gris x 20',
      amount: 650000,
      expenseDate: null,
      phaseId: null,
    })
    expect(toExpenseRequest({ ...form, expenseDate: '2026-10-20', phaseId: 'f1' })).toMatchObject({
      expenseDate: '2026-10-20',
      phaseId: 'f1',
    })
  })
})
