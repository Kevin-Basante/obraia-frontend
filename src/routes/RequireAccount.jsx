import { Link, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { t } from '../i18n/i18n.js'

/**
 * Pages that save data in the backend. Guests can browse the rest of the
 * app, but these need a real account.
 */
export function RequireAccount() {
  const { status } = useAuth()

  if (status === 'guest') {
    return (
      <section className="card">
        <h1>{t('requireAccount.createAnAccountToSave')}</h1>
        <p className="muted">{t('requireAccount.asAGuestYouCan')}</p>
        <Link to="/register" className="button-link">
          {t('requireAccount.createAccount')}
        </Link>
      </section>
    )
  }
  return <Outlet />
}
