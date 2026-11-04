import { Link, NavLink } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { BrandLogo } from './BrandLogo.jsx'
import { NotificationBell } from './notifications/NotificationBell.jsx'
import './AppHeader.css'

/** Top bar: brand and the links that match the session state. */
export function AppHeader() {
  const { status, user, signOut } = useAuth()

  return (
    <header className="app-header">
      <Link to="/" className="app-header__brand" aria-label="ObraIA home">
        <BrandLogo />
        <span aria-hidden="true">
          Obra<span className="app-header__brand-ai">IA</span>
        </span>
      </Link>
      <nav className="app-header__nav" aria-label="Main">
        <NavLink to="/catalog">Catalog</NavLink>
        {status === 'signedIn' && (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/projects">Projects</NavLink>
            <NotificationBell />
            <NavLink to="/account" className="app-header__user" title="My account">
              {user.firstName}
            </NavLink>
            <button type="button" className="app-header__button button-secondary" onClick={() => signOut()}>
              Sign out
            </button>
          </>
        )}
        {status === 'guest' && <NavLink to="/dashboard">Dashboard</NavLink>}
        {(status === 'signedOut' || status === 'guest') && (
          <>
            <NavLink to="/login">Sign in</NavLink>
            <NavLink to="/register" className="app-header__cta">
              Create account
            </NavLink>
          </>
        )}
      </nav>
    </header>
  )
}
