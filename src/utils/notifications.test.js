import { afterEach, describe, expect, it, vi } from 'vitest'
import { setLanguage } from '../i18n/i18n.js'
import {
  NOTIFICATIONS_CHANGED,
  announceNotificationsChanged,
  notificationLink,
  notificationText,
  timeAgo,
  unreadBadge,
} from './notifications.js'

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

describe('announceNotificationsChanged', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends the event the bell listens to', () => {
    const target = new EventTarget()
    const heard = vi.fn()
    target.addEventListener(NOTIFICATIONS_CHANGED, heard)
    vi.stubGlobal('window', target)

    announceNotificationsChanged()

    expect(heard).toHaveBeenCalledTimes(1)
  })

  it('writes a notification from its type and values', () => {
    const approved = {
      type: { code: 'budget_approved' },
      message: 'Version 2...',
      params: { project: 'Casa', version: '2', amount: '120000000' },
    }
    expect(notificationText(approved)).toMatch(
      /^Version 2 of the budget of "Casa" was approved for \$\s120\.000\.000\.$/,
    )
    setLanguage('es')
    expect(notificationText(approved)).toMatch(/^Se aprobó la versión 2 del presupuesto de "Casa" por/)
    setLanguage('en')
  })

  it('writes the risk with its main reason and the expected delay', () => {
    const risk = {
      type: { code: 'delay_risk' },
      message: 'The risk...',
      params: {
        project: 'Casa',
        level: 'high',
        score: '66.88',
        delayDays: '12',
        reason: 'budget_spent',
        'reason.spent': '110',
      },
    }
    expect(notificationText(risk)).toBe(
      'The risk of "Casa" rose to high (66,9 of 100): 110% of the approved budget is spent. About 12 days of delay are expected.',
    )
    setLanguage('es')
    expect(notificationText({ ...risk, params: { ...risk.params, delayDays: '0', reason: undefined } })).toBe(
      'El riesgo de "Casa" subió a alto (66,9 de 100).',
    )
    setLanguage('en')
  })

  it('keeps the message of older notifications', () => {
    expect(notificationText({ type: { code: 'system' }, message: 'Welcome', params: null })).toBe('Welcome')
  })
})
