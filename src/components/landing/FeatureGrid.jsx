import { RevealSection } from './RevealSection.jsx'
import './FeatureGrid.css'

const FEATURES = [
  { title: 'Prices of your city', text: 'Reference prices and transport by city, in Colombian pesos.' },
  { title: 'AI and your eye', text: 'The AI measures, you check: every difference is shown side by side.' },
  { title: 'Budget versions', text: 'Compare drafts and approve the one you will build with.' },
  { title: 'Work in phases', text: 'A plan per project type, with tasks, dates and progress reports.' },
  { title: 'Early warnings', text: 'Notifications when spending passes the budget or the risk goes up.' },
  { title: 'Built as a team', text: 'Invite the people who manage the project and assign a site manager.' },
]

/** What a user gets, in short sentences. */
export function FeatureGrid() {
  return (
    <RevealSection className="feature-grid" aria-labelledby="feature-grid-title">
      <div className="feature-grid__intro">
        <p className="landing-eyebrow">Made for small builds</p>
        <h2 id="feature-grid-title">Everything a house needs, in one place</h2>
        <p className="muted">
          Families and small builders plan houses of up to two floors without spreadsheets or guesses.
        </p>
      </div>
      <ul className="feature-grid__list">
        {FEATURES.map((feature, index) => (
          <li key={feature.title} style={{ '--step': index }}>
            <h3>{feature.title}</h3>
            <p className="muted">{feature.text}</p>
          </li>
        ))}
      </ul>
    </RevealSection>
  )
}
