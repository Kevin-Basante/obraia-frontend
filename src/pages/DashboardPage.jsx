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
import { t } from '../i18n/i18n.js'

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
        <h1>{user ? `${greetingFor()}, ${user.firstName}` : t('dashboardPage.welcomeToObraia')}</h1>
        <p>{user ? t('dashboardPage.hereIsWhereYourProjects') : t('dashboardPage.tryTheToolsOfObraia')}</p>
      </header>
      {!user && <GuestBanner />}
      <FormAlert>{error && t('dashboardPage.refreshError', { message: error.message })}</FormAlert>
      <div className="dashboard__grid">
        <div className="dashboard__main">
          {user ? (
            <SignedInDashboard />
          ) : (
            <section className="card dashboard__empty">
              <h2>{t('dashboardPage.yourProjects')}</h2>
              <p className="muted">{t('dashboardPage.projectsAreSavedInYour')}</p>
            </section>
          )}
        </div>
        <aside className="dashboard__side">
          {user && <ProfileCard user={user} />}
          <section className="card dashboard__empty">
            <h2>{t('dashboardPage.catalog')}</h2>
            <p className="muted">{t('dashboardPage.seeTheMaterialsWithTheir')}</p>
            <Link to="/catalog" className="button-link">
              {t('dashboardPage.exploreTheCatalog')}
            </Link>
          </section>
        </aside>
      </div>
    </div>
  )
}
