import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.js'

/** Session state and actions: { status, user, signIn, signOut, continueAsGuest, updateUser }. */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
