import { todayIso } from './progressForm.js'

// Rules of an expense, checked before sending the form. Same limits as the backend.

export const EXPENSE_CATEGORIES = [
  { value: 'materials', label: 'Materials' },
  { value: 'labor', label: 'Labor' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'tax', label: 'Taxes' },
  { value: 'other', label: 'Other' },
]

export const EMPTY_EXPENSE_FORM = { category: '', description: '', amount: '', expenseDate: '', phaseId: '' }

const MAX_AMOUNT = 999999999999.99
// "650.000" or "650.000,50": dots group the thousands, as written in Colombia.
const GROUPED_PATTERN = /^\d{1,3}(\.\d{3})+(,\d{1,2})?$/
// "650000", "650000,5" or "650000.50".
const PLAIN_PATTERN = /^\d+([.,]\d{1,2})?$/

/** "$ 650.000" -> 650000. Returns null if it is not a valid amount. */
export function parseMoney(text) {
  const normalized = text.replace(/[\s$]/g, '')
  let value = null
  if (GROUPED_PATTERN.test(normalized)) value = Number(normalized.replaceAll('.', '').replace(',', '.'))
  else if (PLAIN_PATTERN.test(normalized)) value = Number(normalized.replace(',', '.'))
  return value !== null && value > 0 && value <= MAX_AMOUNT ? value : null
}

/** Returns one message per invalid field (empty if the form is valid). */
export function validateExpense(form, today = todayIso()) {
  const errors = {}
  if (!EXPENSE_CATEGORIES.some((category) => category.value === form.category)) errors.category = 'Choose the category'
  const description = form.description.trim()
  if (description.length === 0) errors.description = 'Write what the money was spent on'
  else if (description.length > 255) errors.description = 'Use at most 255 characters'
  if (parseMoney(form.amount) === null) errors.amount = 'Enter an amount greater than 0, like 650.000'
  if (form.expenseDate && form.expenseDate > today) errors.expenseDate = 'The date cannot be in the future'
  return errors
}

/** Body that the backend expects. Without a date the backend uses today. */
export function toExpenseRequest(form) {
  return {
    category: form.category,
    description: form.description.trim(),
    amount: parseMoney(form.amount),
    expenseDate: form.expenseDate || null,
    phaseId: form.phaseId || null,
  }
}
