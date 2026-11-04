import { RevealSection } from './RevealSection.jsx'
import './HowItWorks.css'

const STEPS = [
  {
    title: 'Upload the blueprint',
    text: 'A photo or a PDF of the plans of your house. Up to two floors.',
    icon: 'M6 4h9l5 5v11H6zM15 4v5h5M9 13h8M9 16h6',
  },
  {
    title: 'The AI measures it',
    text: 'It reads walls, floors, slabs and roofs, and you compare them with your own measurements.',
    icon: 'M4 17 17 4l3 3L7 20H4zM8 13l2 2M11 10l2 2M14 7l2 2',
  },
  {
    title: 'Get the budget',
    text: 'Materials, waste, transport, labor and VAT with the reference prices of your city.',
    icon: 'M12 3v18M16.5 7.5C16 6 14.3 5 12 5c-2.8 0-4.5 1.3-4.5 3.2 0 4.3 9 2.4 9 6.8 0 2-1.9 3.5-4.5 3.5-2.4 0-4.2-1-4.8-2.7',
  },
  {
    title: 'Follow the work',
    text: 'Phases, tasks, expenses and an alert when the project risks a delay or a budget overrun.',
    icon: 'M4 19h16M6 16l4-5 3 3 5-7M15 7h3v3',
  },
]

/** The four steps from a blueprint to a project under control. */
export function HowItWorks() {
  return (
    <RevealSection className="how-it-works" aria-labelledby="how-it-works-title">
      <p className="landing-eyebrow">How it works</p>
      <h2 id="how-it-works-title">From the drawing to the last brick</h2>
      <ol className="how-it-works__steps">
        {STEPS.map((step, index) => (
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
