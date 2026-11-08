import { Link, NavLink } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { BrandLogo } from './BrandLogo.jsx'
import { NotificationBell } from './notifications/NotificationBell.jsx'
import { LanguageToggle } from './language/LanguageToggle.jsx'
import { ThemeToggle } from './theme/ThemeToggle.jsx'
import './AppHeader.css'
import { t } from '../i18n/i18n.js'

/** Top bar: brand and the links that match the session state. */
export function AppHeader() {
  const { status, user, signOut } = useAuth()

  return (
    <header className="app-header">
      <Link to="/" className="app-header__brand" aria-label={t('header.home')}>
        <BrandLogo />
        <span aria-hidden="true">
          Obra<span className="app-header__brand-ai">IA</span>
        </span>
      </Link>
      <nav className="app-header__nav" aria-label={t('header.main')}>
        <NavLink to="/catalog">{t('header.catalog')}</NavLink>
        {status === 'signedIn' && (
          <>
            <NavLink to="/dashboard">{t('header.dashboard')}</NavLink>
            <NavLink to="/projects">{t('header.projects')}</NavLink>
            <NotificationBell />
            <NavLink to="/account" className="app-header__user" title={t('header.myAccount')}>
              {user.firstName}
            </NavLink>
            <button type="button" className="app-header__button button-secondary" onClick={() => signOut()}>
              {t('header.signOut')}
            </button>
          </>
        )}
        {status === 'guest' && <NavLink to="/dashboard">{t('header.dashboard')}</NavLink>}
        {(status === 'signedOut' || status === 'guest') && (
          <>
            <NavLink to="/login">{t('header.signIn')}</NavLink>
            <NavLink to="/register" className="app-header__cta">
              {t('header.createAccount')}
            </NavLink>
          </>
        )}
        <LanguageToggle />
        <ThemeToggle />
      </nav>
    </header>
  )
}
