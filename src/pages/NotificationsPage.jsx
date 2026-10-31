import { useCallback } from 'react'
import { ErrorState } from '../components/ErrorState.jsx'
import { FormAlert } from '../components/FormAlert.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { PageHeader } from '../components/PageHeader.jsx'
import { NotificationList } from '../components/notifications/NotificationList.jsx'
import { useApiData } from '../hooks/useApiData.js'
import { useFormSubmit } from '../hooks/useFormSubmit.js'
import {
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from '../services/notificationService.js'
import { announceNotificationsChanged } from '../utils/notifications.js'

/** Automatic messages about the projects of the user: approved budgets, expenses over budget and risk. */
export function NotificationsPage() {
  const notifications = useApiData((signal) => listNotifications({ signal }), [])
  const { retry } = notifications
  const afterChange = useCallback(() => {
    retry()
    announceNotificationsChanged()
  }, [retry])
  const markOne = useCallback((notificationId) => markNotificationRead(notificationId).then(afterChange), [afterChange])
  const markAll = useCallback(() => markAllNotificationsRead().then(afterChange), [afterChange])
  const marking = useFormSubmit(markOne)
  const markingAll = useFormSubmit(markAll)

  if (notifications.status === 'error') return <ErrorState error={notifications.error} onRetry={retry} />
  if (!notifications.data) return <LoadingState title="Loading the notifications…" />

  const unread = notifications.data.filter((notification) => !notification.read).length

  return (
    <div className="workspace">
      <PageHeader
        title="Notifications"
        description={unread === 0 ? 'Everything is read.' : `${unread} not read yet.`}
        actions={
          unread > 0 && (
            <button type="button" disabled={markingAll.pending} onClick={() => markingAll.submit()}>
              {markingAll.pending ? 'Marking…' : 'Mark all as read'}
            </button>
          )
        }
      />
      <section className="card">
        {notifications.data.length === 0 ? (
          <p className="muted">
            There are no notifications yet. They arrive when a budget is approved, when the expenses pass the budget and
            when the risk of a project rises to high.
          </p>
        ) : (
          <NotificationList
            notifications={notifications.data}
            onMarkRead={(notification) => marking.submit(notification.id)}
            busy={marking.pending || markingAll.pending}
          />
        )}
        <FormAlert>{(marking.error ?? markingAll.error)?.message}</FormAlert>
      </section>
    </div>
  )
}
