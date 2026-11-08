import { Link } from 'react-router'
import { notificationLink, notificationText, timeAgo } from '../../utils/notifications.js'
import './NotificationList.css'
import { codeLabel, t } from '../../i18n/i18n.js'

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
              <p>{notificationText(notification)}</p>
              <p className="muted notification-list__meta">
                {codeLabel('notificationType', notification.type)}
                {notification.projectName && <> · {notification.projectName}</>} · {timeAgo(notification.createdAt)}
              </p>
            </div>
            <div className="button-row">
              {link && (
                <Link to={link} className="button-link button-secondary button-small">
                  {t('notificationList.open')}
                </Link>
              )}
              {!notification.read && (
                <button
                  type="button"
                  className="button-secondary button-small"
                  disabled={busy}
                  onClick={() => onMarkRead(notification)}
                >
                  {t('notificationList.markAsRead')}
                </button>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
