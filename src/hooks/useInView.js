import { useEffect, useRef, useState } from 'react'

/**
 * True once the element has entered the screen, to start its animation then.
 * Without IntersectionObserver (old browsers, tests) it is visible right away.
 */
export function useInView({ threshold = 0.2 } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    const element = ref.current
    if (inView || !element) return undefined
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [inView, threshold])

  return [ref, inView]
}
