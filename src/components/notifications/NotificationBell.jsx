import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router'
import { useApiData } from '../../hooks/useApiData.js'
import { getUnreadCount } from '../../services/notificationService.js'
import { NOTIFICATIONS_CHANGED, unreadBadge } from '../../utils/notifications.js'
import './NotificationBell.css'

// The count is read again every minute, on every page change and when a page marks notifications as read.
const REFRESH_MS = 60000

/** Link to the notifications with the number of unread ones. */
export function NotificationBell() {
  const { pathname } = useLocation()
  const [tick, setTick] = useState(0)
  const unread = useApiData((signal) => getUnreadCount({ signal }), [pathname, tick])

  useEffect(() => {
    const refresh = () => setTick((n) => n + 1)
    const timer = window.setInterval(refresh, REFRESH_MS)
    window.addEventListener(NOTIFICATIONS_CHANGED, refresh)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener(NOTIFICATIONS_CHANGED, refresh)
    }
  }, [])

  const badge = unreadBadge(unread.data?.count)

  return (
    <NavLink
      to="/notifications"
      className="notification-bell"
      aria-label={badge ? `Notifications, ${badge} not read` : 'Notifications'}
    >
      Notifications
      {badge && (
        <span className="notification-bell__count" aria-hidden="true">
          {badge}
        </span>
      )}
    </NavLink>
  )
}
