import { describe, expect, it } from 'vitest'
import { notificationLink, timeAgo, unreadBadge } from './notifications.js'

const now = new Date('2026-10-31T15:00:00Z')

describe('notification helpers', () => {
  it('shows the unread count on the bell', () => {
    expect(unreadBadge(0)).toBeNull()
    expect(unreadBadge(7)).toBe('7')
    expect(unreadBadge(150)).toBe('99+')
  })

  it('says how long ago a notification arrived', () => {
    expect(timeAgo('2026-10-31T14:59:30Z', now)).toBe('just now')
    expect(timeAgo('2026-10-31T14:55:00Z', now)).toBe('5 min ago')
    expect(timeAgo('2026-10-31T12:00:00Z', now)).toBe('3 h ago')
    expect(timeAgo('2026-10-30T12:00:00Z', now)).toBe('1 day ago')
    expect(timeAgo('2026-10-28T12:00:00Z', now)).toBe('3 days ago')
    expect(timeAgo('2026-10-01T12:00:00Z', now)).toBe('Oct 1, 2026')
  })

  it('links each notification to the page that explains it', () => {
    const notification = (code, projectId = 'p1') => ({ type: { code }, projectId })

    expect(notificationLink(notification('budget_deviation'))).toBe('/projects/p1/expenses')
    expect(notificationLink(notification('budget_approved'))).toBe('/projects/p1/budgets')
    expect(notificationLink(notification('delay_risk'))).toBe('/projects/p1')
    expect(notificationLink(notification('system', null))).toBeNull()
  })
})
