import { Link } from 'react-router'
import { notificationLink, timeAgo } from '../../utils/notifications.js'
import './NotificationList.css'

/** Notifications, newest first. The unread ones are bold and have a button to mark them as read. */
export function NotificationList({ notifications, onMarkRead, busy }) {
  return (
    <ul className="notification-list">
      {notifications.map((notification) => {
        const link = notificationLink(notification)
        return (
          <li
            key={notification.id}
            className={`notification-list__item${notification.read ? '' : ' notification-list__item--unread'}`}
          >
            <div className="notification-list__body">
              <p>{notification.message}</p>
              <p className="muted notification-list__meta">
                {notification.type.label}
                {notification.projectName && <> · {notification.projectName}</>} · {timeAgo(notification.createdAt)}
              </p>
            </div>
            <div className="button-row">
              {link && (
                <Link to={link} className="button-link button-secondary button-small">
                  Open
                </Link>
              )}
              {!notification.read && (
                <button
                  type="button"
                  className="button-secondary button-small"
                  disabled={busy}
                  onClick={() => onMarkRead(notification)}
                >
                  Mark as read
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
