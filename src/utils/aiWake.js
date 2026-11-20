/** The backend wakes the AI at most every few minutes; the site does not ask more often either. */
export const AI_WAKE_EVERY_MS = 5 * 60 * 1000

/**
 * After this time without clicks, keys or scrolling the site stops keeping
 * the AI awake, so a forgotten tab does not use the free hours of the hosting.
 */
export const AI_IDLE_LIMIT_MS = 20 * 60 * 1000

/** True when the last wake-up was long enough ago to send another one. */
export function isAiWakeDue(now, lastWake) {
  return now - lastWake >= AI_WAKE_EVERY_MS
}

/**
 * The AI is kept awake for people with an account who are looking at the
 * site and used it a moment ago. Guests cannot analyze blueprints.
 */
export function shouldKeepAiAwake({ status, visible, now, lastActivity }) {
  return status === 'signedIn' && visible && now - lastActivity < AI_IDLE_LIMIT_MS
}
