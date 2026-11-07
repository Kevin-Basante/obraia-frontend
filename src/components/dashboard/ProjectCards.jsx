import { Link } from 'react-router'
import { ProgressBar } from '../phases/ProgressBar.jsx'
import { StatusBadge } from '../projects/StatusBadge.jsx'
import { formatCurrency } from '../../utils/format.js'
import { formatScore } from '../../utils/risk.js'
import './ProjectCards.css'

/** Each project with its progress, money and risk; the card opens the dashboard of the project. */
export function ProjectCards({ cards }) {
  return (
    <ul className="project-cards">
      {cards.map(({ project, progressPct, approvedBudget, totalSpent, spentPct, risk }) => (
        <li key={project.id}>
          <Link to={`/projects/${project.id}`} className="project-cards__card">
            <span className="project-cards__top">
              <strong>{project.name}</strong>
              <StatusBadge status={project.status} />
            </span>
            <span className="muted">
              {project.projectTypeName} · {project.city}
            </span>
            <span className="project-cards__row">
              <span className="project-cards__label">Progress</span>
              <ProgressBar value={progressPct} label={`Progress of ${project.name}`} />
            </span>
            <span className="project-cards__row">
              <span className="project-cards__label">Budget</span>
              {approvedBudget === null ? (
                <span className="muted">No approved budget · {formatCurrency(totalSpent)} spent</span>
              ) : (
                <ProgressBar value={spentPct} label={`Budget of ${project.name} spent`} />
              )}
            </span>
            <span className="project-cards__risk">
              <span className="project-cards__label">Risk</span>
              {risk ? (
                <>
                  <StatusBadge status={risk.level} />
                  <span className="project-cards__score">{formatScore(risk.score)} / 100</span>
                </>
              ) : (
                <span className="muted">Not assessed yet</span>
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
