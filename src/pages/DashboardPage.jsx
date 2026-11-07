import { Link } from 'react-router'
import { FormAlert } from '../components/FormAlert.jsx'
import { GuestBanner } from '../components/GuestBanner.jsx'
import { ProfileCard } from '../components/ProfileCard.jsx'
import { PortfolioTotals } from '../components/dashboard/PortfolioTotals.jsx'
import { YourProjects } from '../components/dashboard/YourProjects.jsx'
import { useApiData } from '../hooks/useApiData.js'
import { useCurrentUser } from '../hooks/useCurrentUser.js'
import { getPortfolio } from '../services/dashboardService.js'
import { greetingFor, longDate } from '../utils/greeting.js'
import './DashboardPage.css'

/** Signed-in user: totals and every project at a glance. */
function SignedInDashboard() {
  const portfolio = useApiData((signal) => getPortfolio({ signal }), [])
  return (
    <>
      {portfolio.data && <PortfolioTotals portfolio={portfolio.data} />}
      <YourProjects portfolio={portfolio} />
    </>
  )
}

/** Start page after signing in: totals, every project with its progress, profile and the catalog. */
export function DashboardPage() {
  const { user, error } = useCurrentUser()

  return (
    <div className="dashboard">
      <header className="dashboard__banner">
        <p className="dashboard__date">{longDate()}</p>
        <h1>{user ? `${greetingFor()}, ${user.firstName}` : 'Welcome to ObraIA'}</h1>
        <p>
          {user ? 'Here is where your projects stand today.' : 'Try the tools of ObraIA before creating your account.'}
        </p>
      </header>
      {!user && <GuestBanner />}
      <FormAlert>{error && `We could not refresh your profile: ${error.message}`}</FormAlert>
      <div className="dashboard__grid">
        <div className="dashboard__main">
          {user ? (
            <SignedInDashboard />
          ) : (
            <section className="card dashboard__empty">
              <h2>Your projects</h2>
              <p className="muted">Projects are saved in your account. Create one to plan and quote your work.</p>
            </section>
          )}
        </div>
        <aside className="dashboard__side">
          {user && <ProfileCard user={user} />}
          <section className="card dashboard__empty">
            <h2>Catalog</h2>
            <p className="muted">
              See the materials with their reference prices, the phases of each project type and the cities.
            </p>
            <Link to="/catalog" className="button-link">
              Explore the catalog
            </Link>
          </section>
        </aside>
      </div>
    </div>
  )
}
