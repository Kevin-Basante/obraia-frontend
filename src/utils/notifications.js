import { formatCurrency, formatDate } from './format.js'
import { formatScore, riskDetailText } from './risk.js'
import { codeText, hasText, t } from '../i18n/i18n.js'

// Helpers for the notifications of the user.

// The bell listens to this event to read the unread count again.
export const NOTIFICATIONS_CHANGED = 'obraia:notifications-changed'

/** Tells the bell that notifications were read. */
export function announceNotificationsChanged() {
  window.dispatchEvent(new Event(NOTIFICATIONS_CHANGED))
}

/** Values of a reason of risk, saved with the prefix "reason.": { "reason.spent": "110" } -> { spent: "110" }. */
function reasonParams(params) {
  return Object.fromEntries(
    Object.entries(params)
      .filter(([key]) => key.startsWith('reason.'))
      .map(([key, value]) => [key.slice('reason.'.length), value]),
  )
}

function riskText(params) {
  const level = codeText('status', params.level).toLowerCase()
  let text = t('notificationText.delay_risk', { project: params.project, level, score: formatScore(params.score) })
  if (params.reason) text += `: ${riskDetailText(params.reason, reasonParams(params), '')}`
  text += '.'
  const days = Number(params.delayDays)
  if (days > 0) text += ` ${t('notificationText.delay', { count: days })}`
  return text
}

/**
 * Text of a notification in the current language, built from its type and the
 * values the backend saved. Older notifications have no values and keep the
 * English message.
 */
export function notificationText(notification) {
  const { params, type } = notification
  if (!params || !hasText(`notificationText.${type.code}`)) return notification.message
  if (type.code === 'delay_risk') return riskText(params)
  return t(`notificationText.${type.code}`, {
    ...params,
    amount: params.amount && formatCurrency(params.amount),
    spent: params.spent && formatCurrency(params.spent),
    budget: params.budget && formatCurrency(params.budget),
  })
}

/** Number shown on the bell: nothing at 0 and "99+" above 99. */
export function unreadBadge(count) {
  if (!count) return null
  return count > 99 ? '99+' : String(count)
}

/** "2026-10-31T15:00:00Z" -> "just now", "5 min ago", "3 h ago", "2 days ago" or the date after a week. */
export function timeAgo(isoInstant, now = new Date()) {
  const minutes = Math.floor((now.getTime() - new Date(isoInstant).getTime()) / 60000)
  if (minutes < 1) return t('notifications.justNow')
  if (minutes < 60) return t('notifications.minutesAgo', { minutes })
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return t('notifications.hoursAgo', { hours })
  const days = Math.floor(hours / 24)
  if (days < 7) return t('notifications.daysAgo', { count: days })
  return formatDate(isoInstant.slice(0, 10))
}

/** Page that explains the notification, or null when it is not about a project. */
export function notificationLink(notification) {
  if (!notification.projectId) return null
  const base = `/projects/${notification.projectId}`
  if (notification.type.code === 'budget_deviation') return `${base}/expenses`
  if (notification.type.code === 'budget_approved') return `${base}/budgets`
  return base
}
