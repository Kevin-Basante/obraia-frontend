import { formatDate } from '../../utils/format.js'
import './PlanPreview.css'

function dates(phase) {
  if (!phase.plannedStartDate) return `${phase.durationDays} working days`
  return `${formatDate(phase.plannedStartDate)} to ${formatDate(phase.plannedEndDate)} · ${phase.durationDays} working days`
}

/** Phases that "Create plan" would save, each one with its starting tasks. */
export function PlanPreview({ preview }) {
  const withoutDates = preview.phases.length > 0 && !preview.phases[0].plannedStartDate
  return (
    <div className="plan-preview">
      <p className="muted">
        {preview.projectType}, {preview.sizeCategory === 'small' ? 'small' : 'large'} project:{' '}
        <strong>{preview.phases.length} phases</strong> and {preview.workingDays} working days (Monday to Saturday).
      </p>
      {withoutDates && (
        <p className="muted">The project has no planned start date, so the phases are created without dates.</p>
      )}
      <ol className="plan-preview__list">
        {preview.phases.map((phase) => (
          <li key={phase.order}>
            <strong>{phase.name}</strong>
            <span className="muted"> · {dates(phase)}</span>
            {phase.tasks.length > 0 && <p className="plan-preview__tasks">{phase.tasks.join(' · ')}</p>}
          </li>
        ))}
      </ol>
    </div>
  )
}
