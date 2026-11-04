import { useEffect } from 'react'
import { getHealth } from '../services/healthService.js'

/**
 * Wakes the server up in the background while the visitor reads the page.
 * The free hosting sleeps when nobody uses it, and the first answer can take
 * about a minute; this way signing in is quick. Nothing is shown on screen.
 */
export function useServerWakeUp() {
  useEffect(() => {
    const controller = new AbortController()
    getHealth({ signal: controller.signal }).catch(() => {})
    return () => controller.abort()
  }, [])
}
