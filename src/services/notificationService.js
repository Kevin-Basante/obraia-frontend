import { authorizedRequest } from './session.js'

// Notifications of the signed-in user (/api/notifications).

/** The latest 50, newest first. */
export function listNotifications(options) {
  return authorizedRequest('/api/notifications', options)
}

/** { count } of notifications not read yet. */
export function getUnreadCount(options) {
  return authorizedRequest('/api/notifications/unread-count', options)
}

export function markNotificationRead(notificationId) {
  return authorizedRequest(`/api/notifications/${encodeURIComponent(notificationId)}/read`, { method: 'PATCH' })
}

export function markAllNotificationsRead() {
  return authorizedRequest('/api/notifications/read-all', { method: 'POST' })
}
