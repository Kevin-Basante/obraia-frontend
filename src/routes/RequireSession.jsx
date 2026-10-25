import { Navigate, Outlet, useLocation } from 'react-router'
import { LoadingState } from '../components/LoadingState.jsx'
import { useAuth } from '../hooks/useAuth.js'

/** Pages for signed-in users and guests. Anyone else goes to the sign-in page. */
export function RequireSession() {
  const { status } = useAuth()
  const location = useLocation()

  if (status === 'checking') return <LoadingState title="Checking your session…" />
  if (status === 'signedOut') {
    // After signing in, the user comes back to the page they asked for.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}
