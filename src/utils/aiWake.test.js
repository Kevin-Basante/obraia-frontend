import { describe, expect, it } from 'vitest'
import { AI_IDLE_LIMIT_MS, AI_WAKE_EVERY_MS, isAiWakeDue, shouldKeepAiAwake } from './aiWake.js'

describe('AI wake-up', () => {
  it('sends a wake-up at most every few minutes', () => {
    expect(isAiWakeDue(1000, 0)).toBe(false)
    expect(isAiWakeDue(AI_WAKE_EVERY_MS - 1, 0)).toBe(false)
    expect(isAiWakeDue(AI_WAKE_EVERY_MS, 0)).toBe(true)
  })

  it('sends the first wake-up right away', () => {
    expect(isAiWakeDue(Date.now(), 0)).toBe(true)
  })

  it('keeps the AI awake for a signed-in person who is using the site', () => {
    const now = 10 * AI_IDLE_LIMIT_MS
    const active = { status: 'signedIn', visible: true, now, lastActivity: now - 1000 }

    expect(shouldKeepAiAwake(active)).toBe(true)
    expect(shouldKeepAiAwake({ ...active, status: 'guest' })).toBe(false)
    expect(shouldKeepAiAwake({ ...active, status: 'signedOut' })).toBe(false)
    expect(shouldKeepAiAwake({ ...active, status: 'checking' })).toBe(false)
  })

  it('stops when the tab is hidden or the person left it alone', () => {
    const now = 10 * AI_IDLE_LIMIT_MS
    const active = { status: 'signedIn', visible: true, now, lastActivity: now - 1000 }

    expect(shouldKeepAiAwake({ ...active, visible: false })).toBe(false)
    expect(shouldKeepAiAwake({ ...active, lastActivity: now - AI_IDLE_LIMIT_MS })).toBe(false)
  })
})
