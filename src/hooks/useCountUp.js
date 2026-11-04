import { useEffect, useState } from 'react'
import { countUpValue } from '../utils/countUp.js'

function prefersLessMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

/** A number that grows from 0 to `target` once `start` is true. */
export function useCountUp(target, { start = true, duration = 1600, delay = 0 } = {}) {
  // Without animations the number is shown complete from the start.
  const [value, setValue] = useState(() => (prefersLessMotion() ? target : 0))

  useEffect(() => {
    if (!start || prefersLessMotion()) return undefined
    let frame
    let begin
    const timer = setTimeout(() => {
      const step = (now) => {
        begin ??= now
        const progress = Math.min(1, (now - begin) / duration)
        setValue(countUpValue(target, progress))
        if (progress < 1) frame = requestAnimationFrame(step)
      }
      frame = requestAnimationFrame(step)
    }, delay)
    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(frame)
    }
  }, [target, start, duration, delay])

  return value
}
