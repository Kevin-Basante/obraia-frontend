import './PhaseTimeline.css'

/**
 * Phases in construction order. Each bar is as long as the phase takes,
 * compared with the longest one.
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
        {plan.phases.map((phase) => (
          <li key={phase.order} className="phase-timeline__item">
            <span className="phase-timeline__name">
              {phase.order}. {phase.name}
            </span>
            <span className="phase-timeline__bar" aria-hidden="true">
              <span style={{ width: `${(phase.estimatedDurationDays / longest) * 100}%` }} />
            </span>
            <span className="phase-timeline__days">{phase.estimatedDurationDays} days</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
