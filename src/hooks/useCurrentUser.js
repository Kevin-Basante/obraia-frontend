import { useEffect, useState } from 'react'
import { getCurrentUser } from '../services/userService.js'
import { useAuth } from './useAuth.js'

/**
 * Reloads the profile from the backend when a signed-in page opens, so
 * changes made elsewhere show up. Guests have no profile to load.
 */
export function useCurrentUser() {
  const { status, user, updateUser } = useAuth()
  const [error, setError] = useState(null)

  useEffect(() => {
    if (status !== 'signedIn') return undefined
    const controller = new AbortController()
    getCurrentUser({ signal: controller.signal })
      .then(updateUser)
      .catch((err) => {
        if (err.name !== 'AbortError') setError(err)
      })
    return () => controller.abort()
  }, [status, updateUser])

  return { user, error }
}
