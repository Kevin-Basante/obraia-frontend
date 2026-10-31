import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getUnreadCount,
  listNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from './notificationService.js'

let fetchMock

beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue(
    new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }),
  )
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function sentRequest() {
  const [url, init] = fetchMock.mock.calls[0]
  return { path: new URL(url).pathname, method: init.method }
}

describe('notification services', () => {
  it('lists the notifications of the user', async () => {
    await listNotifications()

    expect(sentRequest()).toEqual({ path: '/api/notifications', method: 'GET' })
  })

  it('reads the unread count', async () => {
    await getUnreadCount()

    expect(sentRequest()).toEqual({ path: '/api/notifications/unread-count', method: 'GET' })
  })

  it('marks one notification as read with PATCH', async () => {
    await markNotificationRead('n1')

    expect(sentRequest()).toEqual({ path: '/api/notifications/n1/read', method: 'PATCH' })
  })

  it('marks all of them as read with POST', async () => {
    await markAllNotificationsRead()

    expect(sentRequest()).toEqual({ path: '/api/notifications/read-all', method: 'POST' })
  })
})
