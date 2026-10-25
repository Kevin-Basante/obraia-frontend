import { createContext } from 'react'

/**
 * Session shared by the whole app. `status` is one of:
 * 'checking' (reading the saved session), 'signedIn', 'guest' or 'signedOut'.
 */
export const AuthContext = createContext(null)
