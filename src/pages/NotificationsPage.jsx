import { useCallback } from 'react'
import { ErrorState } from '../components/ErrorState.jsx'
import { FormAlert } from '../components/FormAlert.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { PageHeader } from '../components/PageHeader.jsx'
import { NotificationList } from '../components/notifications/NotificationList.jsx'
import { useApiData } from '../hooks/useApiData.js'
import { useFormSubmit } from '../hooks/useFormSubmit.js'
import { listNotifications, markAllNotificationsRead, markNotificationRead } from '../services/notificationService.js'
import { announceNotificationsChanged } from '../utils/notifications.js'
import { t } from '../i18n/i18n.js'

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
  if (!notifications.data) return <LoadingState title={t('notificationsPage.loadingTheNotifications')} />

  const unread = notifications.data.filter((notification) => !notification.read).length

  return (
    <div className="workspace">
      <PageHeader
        title={t('notificationsPage.notifications')}
        description={
          unread === 0 ? t('notificationsPage.everythingIsRead') : t('notificationsPage.unread', { count: unread })
        }
        actions={
          unread > 0 && (
            <button type="button" disabled={markingAll.pending} onClick={() => markingAll.submit()}>
              {markingAll.pending ? t('notificationsPage.marking') : t('notificationsPage.markAllAsRead')}
            </button>
          )
        }
      />
      <section className="card">
        {notifications.data.length === 0 ? (
          <p className="muted">{t('notificationsPage.thereAreNoNotificationsYet')}</p>
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
