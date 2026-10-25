import { Link } from 'react-router'
import { FormAlert } from '../components/FormAlert.jsx'
import { GuestBanner } from '../components/GuestBanner.jsx'
import { ProfileCard } from '../components/ProfileCard.jsx'
import { useCurrentUser } from '../hooks/useCurrentUser.js'
import './DashboardPage.css'

/** Start page after signing in. Projects and quotations will be added here. */
export function DashboardPage() {
  const { user, error } = useCurrentUser()

  return (
    <div className="dashboard">
      {user ? (
        <h1>Hello, {user.firstName}</h1>
      ) : (
        <>
          <h1>Welcome to ObraIA</h1>
          <GuestBanner />
        </>
      )}
      <FormAlert>{error && `We could not refresh your profile: ${error.message}`}</FormAlert>
      {user && <ProfileCard user={user} />}
      <section className="card dashboard__empty">
        <h2>Your projects</h2>
        <p className="muted">You have no projects yet. Soon you will create one here and upload its blueprints.</p>
      </section>
      <section className="card dashboard__empty">
        <h2>Catalog</h2>
        <p className="muted">See the materials with their reference prices, the phases of each project type and the cities.</p>
        <Link to="/catalog" className="button-link">
          Explore the catalog
        </Link>
      </section>
    </div>
  )
}
