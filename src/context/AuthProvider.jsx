import { useCallback, useEffect, useMemo, useState } from 'react'
import { login, logout } from '../services/authService.js'
import { refreshSession } from '../services/session.js'
import { clearTokens, getRefreshToken, saveTokens } from '../services/tokenStorage.js'
import { AuthContext } from './AuthContext.js'

/** Keeps the session state and offers the actions to change it. */
export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: 'checking', user: null })

  // On load, a saved refresh token means the user was signed in before.
  useEffect(() => {
    let active = true
    refreshSession()
      .catch(() => null)
      .then((user) => {
        if (active) setState(user ? { status: 'signedIn', user } : { status: 'signedOut', user: null })
      })
    return () => {
      active = false
    }
  }, [])

  const signIn = useCallback(async (email, password) => {
    const session = await login(email, password)
    saveTokens(session)
    setState({ status: 'signedIn', user: session.user })
    return session.user
  }, [])

  const signOut = useCallback(async () => {
    const refreshToken = getRefreshToken()
    clearTokens()
    setState({ status: 'signedOut', user: null })
    // The local session is already closed; the backend call only revokes the token.
    if (refreshToken) await logout(refreshToken).catch(() => null)
  }, [])

  const continueAsGuest = useCallback(() => {
    setState({ status: 'guest', user: null })
  }, [])

  const updateUser = useCallback((user) => {
    setState((current) => ({ ...current, user }))
  }, [])

  const value = useMemo(
    () => ({ ...state, signIn, signOut, continueAsGuest, updateUser }),
    [state, signIn, signOut, continueAsGuest, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
