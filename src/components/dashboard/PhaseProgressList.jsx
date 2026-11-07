import { Link } from 'react-router'
import { LineArt } from '../art/LineArt.jsx'
import { ProgressBar } from '../phases/ProgressBar.jsx'
import { StatusBadge } from '../projects/StatusBadge.jsx'
import { phaseArt } from '../../utils/artFor.js'
import { shortRange } from '../../utils/dashboard.js'
import './DashboardCard.css'
import './PhaseProgressList.css'

/** Every phase of the plan in one look: drawing, status, dates and progress. */
export function PhaseProgressList({ projectId, phases }) {
  return (
    <section className="card">
      <div className="dashboard-card__header">
        <h2>Phases</h2>
        <Link to={`/projects/${projectId}/phases`}>Open phases and tasks</Link>
      </div>
      {phases.length === 0 ? (
        <p className="muted">
          The plan has not been created yet. Create it from the standard phases of the project type.
        </p>
      ) : (
        <ol className="phase-progress">
          {phases.map((phase) => (
            <li key={phase.id} className="phase-progress__item">
              <LineArt set="phase" art={phaseArt(phase.name)} className="phase-progress__art" />
              <div className="phase-progress__info">
                <span className="phase-progress__name">
                  <span className="phase-progress__order">{String(phase.order).padStart(2, '0')}</span>
                  {phase.name}
                </span>
                <span className="phase-progress__meta">
                  <StatusBadge status={phase.status} />
                  {phase.late && <span className="dashboard-late">Late</span>}
                  <span>{shortRange(phase.plannedStartDate, phase.plannedEndDate) ?? 'No dates'}</span>
                </span>
              </div>
              <div className="phase-progress__bar">
                <ProgressBar value={phase.progressPct} label={`Progress of ${phase.name}`} />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}
