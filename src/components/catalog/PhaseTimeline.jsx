import { LineArt } from '../art/LineArt.jsx'
import { phaseArt } from '../../utils/artFor.js'
import './PhaseTimeline.css'

/**
 * Phases in construction order, as a roadmap: each stop has its drawing and a
 * bar as long as the phase takes, compared with the longest one.
 */
export function PhaseTimeline({ plan, updating }) {
  const longest = Math.max(...plan.phases.map((phase) => phase.estimatedDurationDays))
  const months = (plan.totalDurationDays / 30).toFixed(1)

  return (
    <div className={`phase-timeline${updating ? ' phase-timeline--updating' : ''}`}>
      <p className="phase-timeline__total">
        <strong>{plan.totalDurationDays} days</strong> in total (about {months} months), one phase after the other.
      </p>
      <ol className="phase-timeline__list">
        {plan.phases.map((phase, index) => (
          <li key={phase.order} className="phase-timeline__item" style={{ '--step': index }}>
            <span className="phase-timeline__marker" aria-hidden="true">
              {String(phase.order).padStart(2, '0')}
            </span>
            <div className="phase-timeline__art">
              <LineArt set="phase" art={phaseArt(phase.name)} animated />
            </div>
            <div className="phase-timeline__info">
              <span className="phase-timeline__name">{phase.name}</span>
              <span className="phase-timeline__bar" aria-hidden="true">
                <span style={{ width: `${(phase.estimatedDurationDays / longest) * 100}%` }} />
              </span>
            </div>
            <span className="phase-timeline__days">{phase.estimatedDurationDays} days</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
