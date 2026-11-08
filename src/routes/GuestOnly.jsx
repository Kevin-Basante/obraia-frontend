import { Navigate, Outlet } from 'react-router'
import { LoadingState } from '../components/LoadingState.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { t } from '../i18n/i18n.js'

/** Sign-in and registration pages: a signed-in user goes straight to the dashboard. */
export function GuestOnly() {
  const { status } = useAuth()

  if (status === 'checking') return <LoadingState title={t('guestOnly.checkingYourSession')} />
  if (status === 'signedIn') return <Navigate to="/dashboard" replace />
  return <Outlet />
}
