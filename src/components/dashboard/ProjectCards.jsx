import { Link } from 'react-router'
import { ProgressBar } from '../phases/ProgressBar.jsx'
import { StatusBadge } from '../projects/StatusBadge.jsx'
import { formatCurrency } from '../../utils/format.js'
import { formatScore } from '../../utils/risk.js'
import './ProjectCards.css'
import { t } from '../../i18n/i18n.js'

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
              <span className="project-cards__label">{t('projectCards.progress')}</span>
              <ProgressBar value={progressPct} label={t('progressBar.of', { name: project.name })} />
            </span>
            <span className="project-cards__row">
              <span className="project-cards__label">{t('projectCards.budget')}</span>
              {approvedBudget === null ? (
                <span className="muted">{t('projectCards.noBudgetSpent', { spent: formatCurrency(totalSpent) })}</span>
              ) : (
                <ProgressBar value={spentPct} label={t('projectCards.budgetOf', { name: project.name })} />
              )}
            </span>
            <span className="project-cards__risk">
              <span className="project-cards__label">{t('projectCards.risk')}</span>
              {risk ? (
                <>
                  <StatusBadge status={risk.level} />
                  <span className="project-cards__score">{formatScore(risk.score)} / 100</span>
                </>
              ) : (
                <span className="muted">{t('projectCards.notAssessedYet')}</span>
              )}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
