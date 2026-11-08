import { todayIso } from './progressForm.js'
import { codeText, t } from '../i18n/i18n.js'

// Rules of an expense, checked before sending the form. Same limits as the backend.

export const EXPENSE_CATEGORIES = ['materials', 'labor', 'equipment', 'tax', 'other']

/** Options of the category list, in the current language. */
export function expenseCategoryOptions() {
  return EXPENSE_CATEGORIES.map((code) => ({ value: code, label: codeText('expenseCategory', code) }))
}

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
  if (!EXPENSE_CATEGORIES.includes(form.category)) errors.category = t('expenseForm.chooseTheCategory')
  const description = form.description.trim()
  if (description.length === 0) errors.description = t('expenseForm.writeWhatTheMoneyWas')
  else if (description.length > 255) errors.description = t('expenseForm.useAtMost255Characters')
  if (parseMoney(form.amount) === null) errors.amount = t('expenseForm.enterAnAmountGreaterThan')
  if (form.expenseDate && form.expenseDate > today) errors.expenseDate = t('expenseForm.theDateCannotBeIn')
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
