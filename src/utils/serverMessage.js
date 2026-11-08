import { formatDate } from './format.js'
import { hasText, t } from '../i18n/i18n.js'

/**
 * Text of a message of the backend ({ message, code?, params? }) in the
 * current language. Without a known code it keeps the English message.
 */
export function serverMessage(response) {
  const key = `serverMessages.${response.code}`
  if (!response.code || !hasText(key)) return response.message
  const params = { ...response.params }
  if (params.purgeDate) params.purgeDate = formatDate(params.purgeDate)
  return t(key, params)
}
