import { useEffect } from 'react'
import { wakeAi } from '../services/reportService.js'

// The backend wakes the AI at most every few minutes; the page does not ask more often either.
const WAKE_EVERY_MS = 5 * 60 * 1000
let lastWake = 0

/**
 * Wakes the AI service in the background when a page that may use it opens:
 * the free hosting puts it to sleep, and the first analysis or summary would
 * wait about a minute. Nothing is shown on screen.
 */
export function useAiWakeUp() {
  useEffect(() => {
    if (Date.now() - lastWake < WAKE_EVERY_MS) return
    lastWake = Date.now()
    wakeAi().catch(() => {})
  }, [])
}
