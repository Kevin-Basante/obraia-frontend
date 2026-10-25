import { Link, NavLink } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import './AppHeader.css'

/** Top bar: brand and the links that match the session state. */
export function AppHeader() {
  const { status, user, signOut } = useAuth()

  return (
    <header className="app-header">
      <Link to="/" className="app-header__brand">
        ObraIA
      </Link>
      <nav className="app-header__nav" aria-label="Main">
        {status === 'signedIn' && (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <span className="app-header__user">{user.firstName}</span>
            <button type="button" className="app-header__button" onClick={signOut}>
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
