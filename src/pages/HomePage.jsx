import { Link, useNavigate } from 'react-router'
import { FeatureGrid } from '../components/landing/FeatureGrid.jsx'
import { HowItWorks } from '../components/landing/HowItWorks.jsx'
import { PhaseRoadmap } from '../components/landing/PhaseRoadmap.jsx'
import { BlueprintScene } from '../components/landing/BlueprintScene.jsx'
import { RevealSection } from '../components/landing/RevealSection.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useServerWakeUp } from '../hooks/useServerWakeUp.js'
import './HomePage.css'
import { t } from '../i18n/i18n.js'

/** Landing page: what ObraIA does, how it works, the phases of a build and how to start. */
export function HomePage() {
  const { status, continueAsGuest } = useAuth()
  const navigate = useNavigate()
  useServerWakeUp()

  function tryAsGuest() {
    continueAsGuest()
    navigate('/dashboard')
  }

  const actions =
    status === 'signedIn' ? (
      <Link to="/dashboard" className="button-link">
        {t('homePage.goToMyDashboard')}
      </Link>
    ) : (
      <>
        <Link to="/register" className="button-link">
          {t('homePage.createAFreeAccount')}
        </Link>
        <button type="button" className="button-secondary" onClick={tryAsGuest}>
          {t('homePage.tryItAsAGuest')}
        </button>
      </>
    )

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero__text">
          <p className="landing-eyebrow">{t('homePage.aiForSmallConstructionProjects')}</p>
          <h1>
            {t('homePage.fromTheBlueprintToYour')} <em>{t('homePage.withoutSurprises')}</em>
          </h1>
          <p className="home-hero__lead">{t('homePage.uploadYourBlueprintAndObraia')}</p>
          <div className="home-hero__actions">{actions}</div>
          {status === 'signedOut' && (
            <p className="muted home-hero__signin">
              {t('homePage.alreadyHaveAnAccount')} <Link to="/login">{t('homePage.signIn')}</Link>
            </p>
          )}
        </div>
        <BlueprintScene />
      </section>

      <HowItWorks />
      <PhaseRoadmap />
      <FeatureGrid />

      {status !== 'signedIn' && (
        <RevealSection className="home-cta">
          <h2>{t('homePage.yourNextHouseStartsWith')}</h2>
          <p>{t('homePage.createYourAccountInA')}</p>
          <div className="home-hero__actions">{actions}</div>
        </RevealSection>
      )}
    </div>
  )
}
