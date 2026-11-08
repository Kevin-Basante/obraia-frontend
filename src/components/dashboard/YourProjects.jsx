import { Link } from 'react-router'
import { ProjectCards } from './ProjectCards.jsx'
import './DashboardCard.css'
import { t } from '../../i18n/i18n.js'

/** Card of the main dashboard with every project of the user. */
export function YourProjects({ portfolio }) {
  const cards = portfolio.data?.projects ?? []

  return (
    <section className="card">
      <div className="dashboard-card__header">
        <h2>{t('yourProjects.yourProjects')}</h2>
        {cards.length > 0 && <Link to="/projects">{t('yourProjects.searchAndFilter')}</Link>}
      </div>
      {portfolio.status === 'loading' && !portfolio.data && <p className="muted">{t('yourProjects.loading')}</p>}
      {portfolio.status === 'error' && (
        <p className="muted">
          {t('yourProjects.weCouldNotLoadYour')} {portfolio.error.message}
        </p>
      )}
      {portfolio.data && cards.length === 0 && <p className="muted">{t('yourProjects.youHaveNoProjectsYet')}</p>}
      {cards.length > 0 && <ProjectCards cards={cards} />}
      <div className="button-row">
        <Link to="/projects/new" className="button-link">
          {t('yourProjects.newProject')}
        </Link>
      </div>
    </section>
  )
}
