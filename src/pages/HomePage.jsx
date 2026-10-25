import { Link, useNavigate } from 'react-router'
import { ErrorState } from '../components/ErrorState.jsx'
import { HelloCard } from '../components/HelloCard.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useHello } from '../hooks/useHello.js'
import './HomePage.css'

/** Landing page: what ObraIA does, how to start and the server status. */
export function HomePage() {
  const { status, continueAsGuest } = useAuth()
  const navigate = useNavigate()
  const hello = useHello()

  function tryAsGuest() {
    continueAsGuest()
    navigate('/dashboard')
  }

  return (
    <>
      <section className="home-hero">
        <h1>Build your house with a clear plan</h1>
        <p className="muted">
          ObraIA estimates materials and costs from your blueprints, organizes the work in phases and warns you
          when the project is at risk of delay.
        </p>
        <div className="home-hero__actions">
          {status === 'signedIn' ? (
            <Link to="/dashboard" className="button-link">
              Go to my dashboard
            </Link>
          ) : (
            <>
              <Link to="/register" className="button-link">
                Create a free account
              </Link>
              <button type="button" className="button-secondary" onClick={tryAsGuest}>
                Try it as a guest
              </button>
            </>
          )}
        </div>
      </section>

      {hello.status === 'loading' && <LoadingState />}
      {hello.status === 'error' && <ErrorState error={hello.error} onRetry={hello.retry} />}
      {hello.status === 'success' && <HelloCard data={hello.data} />}
    </>
  )
}
