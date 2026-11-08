import { formatCurrency } from './format.js'
import { hasText, t } from '../i18n/i18n.js'

// Rows whose description has values; without them the English description stays.
const WITH_VALUES = ['materials', 'transport', 'labor']

/** Description of a row of a budget in the current language, from its layer and the values of the backend. */
export function budgetItemText(item) {
  const key = `budgetText.${item.itemType}`
  if (!hasText(key) || (WITH_VALUES.includes(item.itemType) && !item.params)) return item.description
  const params = { ...item.params }
  if (params.rate) params.rate = formatCurrency(params.rate)
  return t(key, params)
}
