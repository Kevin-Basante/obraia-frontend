import { useEffect, useState } from 'react'

/** Returns the value once it stops changing for `delay` ms, so typing does not send a request per key. */
export function useDebouncedValue(value, delay = 300) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debounced
}
