import { Navigate, Outlet } from 'react-router'
import { LoadingState } from '../components/LoadingState.jsx'
import { useAuth } from '../hooks/useAuth.js'

/** Sign-in and registration pages: a signed-in user goes straight to the dashboard. */
export function GuestOnly() {
  const { status } = useAuth()

  if (status === 'checking') return <LoadingState title="Checking your session…" />
  if (status === 'signedIn') return <Navigate to="/dashboard" replace />
  return <Outlet />
}
