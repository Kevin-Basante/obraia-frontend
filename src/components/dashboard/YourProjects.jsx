import { Link } from 'react-router'
import { ProjectCards } from './ProjectCards.jsx'
import './DashboardCard.css'

/** Card of the main dashboard with every project of the user. */
export function YourProjects({ portfolio }) {
  const cards = portfolio.data?.projects ?? []

  return (
    <section className="card">
      <div className="dashboard-card__header">
        <h2>Your projects</h2>
        {cards.length > 0 && <Link to="/projects">Search and filter</Link>}
      </div>
      {portfolio.status === 'loading' && !portfolio.data && <p className="muted">Loading…</p>}
      {portfolio.status === 'error' && (
        <p className="muted">We could not load your projects: {portfolio.error.message}</p>
      )}
      {portfolio.data && cards.length === 0 && (
        <p className="muted">You have no projects yet. Create one to plan its phases and quotation.</p>
      )}
      {cards.length > 0 && <ProjectCards cards={cards} />}
      <div className="button-row">
        <Link to="/projects/new" className="button-link">
          New project
        </Link>
      </div>
    </section>
  )
}
