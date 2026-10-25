import { useCallback, useState } from 'react'

/**
 * Runs a form action and keeps its state: `pending` while it runs, and the
 * error message and field errors if the backend rejects it.
 */
export function useFormSubmit(action) {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  const submit = useCallback(
    async (...args) => {
      setPending(true)
      setError(null)
      setFieldErrors({})
      try {
        return await action(...args)
      } catch (err) {
        setError(err)
        setFieldErrors(err.fields ?? {})
        return undefined
      } finally {
        setPending(false)
      }
    },
    [action],
  )

  return { submit, pending, error, fieldErrors, setFieldErrors }
}
