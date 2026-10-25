import { Link, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'

/**
 * Pages that save data in the backend. Guests can browse the rest of the
 * app, but these need a real account.
 */
export function RequireAccount() {
  const { status } = useAuth()

  if (status === 'guest') {
    return (
      <section className="card">
        <h1>Create an account to save projects</h1>
        <p className="muted">As a guest you can browse the catalog, but projects are saved in your account.</p>
        <Link to="/register" className="button-link">
          Create account
        </Link>
      </section>
    )
  }
  return <Outlet />
}
