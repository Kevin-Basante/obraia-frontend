import { RevealSection } from './RevealSection.jsx'
import './HowItWorks.css'
import { t } from '../../i18n/i18n.js'

// Read in each render, so the texts follow the language.
function steps() {
  return [
    {
      title: t('howItWorks.uploadTheBlueprint'),
      text: t('howItWorks.aPhotoOrAPdf'),
      icon: 'M6 4h9l5 5v11H6zM15 4v5h5M9 13h8M9 16h6',
    },
    {
      title: t('howItWorks.theAiMeasuresIt'),
      text: t('howItWorks.itReadsWallsFloorsSlabs'),
      icon: 'M4 17 17 4l3 3L7 20H4zM8 13l2 2M11 10l2 2M14 7l2 2',
    },
    {
      title: t('howItWorks.getTheBudget'),
      text: t('howItWorks.materialsWasteTransportLaborAnd'),
      icon: 'M12 3v18M16.5 7.5C16 6 14.3 5 12 5c-2.8 0-4.5 1.3-4.5 3.2 0 4.3 9 2.4 9 6.8 0 2-1.9 3.5-4.5 3.5-2.4 0-4.2-1-4.8-2.7',
    },
    {
      title: t('howItWorks.followTheWork'),
      text: t('howItWorks.phasesTasksExpensesAndAn'),
      icon: 'M4 19h16M6 16l4-5 3 3 5-7M15 7h3v3',
    },
  ]
}

/** The four steps from a blueprint to a project under control. */
export function HowItWorks() {
  return (
    <RevealSection className="how-it-works" aria-labelledby="how-it-works-title">
      <p className="landing-eyebrow">{t('howItWorks.howItWorks')}</p>
      <h2 id="how-it-works-title">{t('howItWorks.fromTheDrawingToThe')}</h2>
      <ol className="how-it-works__steps">
        {steps().map((step, index) => (
          <li key={step.title} className="how-it-works__step" style={{ '--step': index }}>
            <span className="how-it-works__number">{String(index + 1).padStart(2, '0')}</span>
            <svg viewBox="0 0 24 24" className="how-it-works__icon" aria-hidden="true">
              <path d={step.icon} />
            </svg>
            <h3>{step.title}</h3>
            <p className="muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </RevealSection>
  )
}
