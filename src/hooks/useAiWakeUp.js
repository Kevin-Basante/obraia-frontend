import { useEffect } from 'react'
import { wakeAi } from '../services/reportService.js'
import { isAiWakeDue, shouldKeepAiAwake } from '../utils/aiWake.js'
import { useAuth } from './useAuth.js'

const CHECK_EVERY_MS = 60 * 1000
const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'scroll']
let lastWake = 0

/**
 * Keeps the AI service awake while a person with an account uses the site.
 * The free hosting puts it to sleep after a while without calls, and the
 * first analysis or summary would wait about a minute or fail. The first
 * wake-up goes out as soon as the person signs in; then one every few
 * minutes while the tab is visible and the person keeps using it. Nothing
 * is shown on screen.
 */
export function useAiWakeUp() {
  const { status } = useAuth()

  useEffect(() => {
    if (status !== 'signedIn') return undefined
    let lastActivity = Date.now()

    const check = () => {
      const now = Date.now()
      const visible = document.visibilityState === 'visible'
      if (!shouldKeepAiAwake({ status, visible, now, lastActivity }) || !isAiWakeDue(now, lastWake)) return
      lastWake = now
      wakeAi().catch(() => {
        // The next check tries again instead of waiting a few minutes.
        lastWake = 0
      })
    }
    const onActivity = () => {
      lastActivity = Date.now()
      check()
    }

    check()
    const timer = setInterval(check, CHECK_EVERY_MS)
    ACTIVITY_EVENTS.forEach((name) => window.addEventListener(name, onActivity, { passive: true }))
    document.addEventListener('visibilitychange', check)
    return () => {
      clearInterval(timer)
      ACTIVITY_EVENTS.forEach((name) => window.removeEventListener(name, onActivity))
      document.removeEventListener('visibilitychange', check)
    }
  }, [status])
}
