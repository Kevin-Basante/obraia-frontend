import { formatDate } from './format.js'

// Helpers for the notifications of the user.

/** Number shown on the bell: nothing at 0 and "99+" above 99. */
export function unreadBadge(count) {
  if (!count) return null
  return count > 99 ? '99+' : String(count)
}

/** "2026-10-31T15:00:00Z" -> "just now", "5 min ago", "3 h ago", "2 days ago" or the date after a week. */
export function timeAgo(isoInstant, now = new Date()) {
  const minutes = Math.floor((now.getTime() - new Date(isoInstant).getTime()) / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return days === 1 ? '1 day ago' : `${days} days ago`
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
