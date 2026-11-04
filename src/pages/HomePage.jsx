import { Link, useNavigate } from 'react-router'
import { FeatureGrid } from '../components/landing/FeatureGrid.jsx'
import { HowItWorks } from '../components/landing/HowItWorks.jsx'
import { PhaseRoadmap } from '../components/landing/PhaseRoadmap.jsx'
import { BlueprintScene } from '../components/landing/BlueprintScene.jsx'
import { RevealSection } from '../components/landing/RevealSection.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useServerWakeUp } from '../hooks/useServerWakeUp.js'
import './HomePage.css'

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
    )

  return (
    <div className="home">
      <section className="home-hero">
        <div className="home-hero__text">
          <p className="landing-eyebrow">AI for small construction projects</p>
          <h1>
            From the blueprint to your house, <em>without surprises.</em>
          </h1>
          <p className="home-hero__lead">
            Upload your blueprint and ObraIA measures it with AI, quotes the materials with the prices of your city,
            plans the work in phases and warns you before the budget or the schedule slips.
          </p>
          <div className="home-hero__actions">{actions}</div>
          {status === 'signedOut' && (
            <p className="muted home-hero__signin">
              Already have an account? <Link to="/login">Sign in</Link>
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
          <h2>Your next house starts with a drawing.</h2>
          <p>Create your account in a minute. It is free.</p>
          <div className="home-hero__actions">{actions}</div>
        </RevealSection>
      )}
    </div>
  )
}
