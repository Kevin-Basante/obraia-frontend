import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Loads data with `load(signal)` and exposes the three screen states:
 * loading, error and success. It loads again when a value in `deps`
 * changes, and `retry` repeats the request. While a new request runs,
 * `data` keeps the previous answer so the list does not disappear.
 */
export function useApiData(load, deps) {
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ key: null, data: null, error: null })
  const loadRef = useRef(load)

  // Each request is identified by its values; an answer for older values is ignored.
  const requestKey = `${JSON.stringify(deps)}#${attempt}`

  useEffect(() => {
    loadRef.current = load
  })

  useEffect(() => {
    const controller = new AbortController()
    loadRef.current(controller.signal)
      .then((data) => setResult({ key: requestKey, data, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setResult({ key: requestKey, data: null, error })
      })
    return () => controller.abort()
  }, [requestKey])

  const retry = useCallback(() => setAttempt((n) => n + 1), [])

  let status = 'success'
  if (result.key !== requestKey) status = 'loading'
  else if (result.error) status = 'error'

  return { status, data: result.data, error: status === 'error' ? result.error : null, retry }
}
