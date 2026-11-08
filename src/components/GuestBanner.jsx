import { Link } from 'react-router'
import './GuestBanner.css'
import { t } from '../i18n/i18n.js'

/** Reminds guests that nothing is saved and invites them to create an account. */
export function GuestBanner() {
  return (
    <aside className="guest-banner" role="note">
      <p>
        {t('states.guest.before')} <Link to="/register">{t('states.guest.link')}</Link> {t('states.guest.after')}
      </p>
    </aside>
  )
}
