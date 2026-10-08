import { useCallback, useEffect, useState } from 'react'
import { getHello } from '../services/healthService.js'

const INITIAL_STATE = { status: 'loading', data: null, error: null }

/**
 * Loads the hello endpoint and exposes the three screen states:
 * loading, error and success. `retry` repeats the request.
 */
export function useHello() {
  const [state, setState] = useState(INITIAL_STATE)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    // Cancels the request if the component unmounts or the user retries.
    const controller = new AbortController()

    getHello({ signal: controller.signal })
      .then((data) => setState({ status: 'success', data, error: null }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState({ status: 'error', data: null, error })
      })

    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => {
    setState(INITIAL_STATE)
    setAttempt((n) => n + 1)
  }, [])

  return { ...state, retry }
}
