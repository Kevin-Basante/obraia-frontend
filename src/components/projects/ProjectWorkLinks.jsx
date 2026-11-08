import { Link } from 'react-router'
import './ProjectWorkLinks.css'
import { t } from '../../i18n/i18n.js'

// Read in each render, so the texts follow the language.
function sections() {
  return [
    {
      path: 'blueprints',
      title: t('projectWorkLinks.blueprints'),
      text: t('projectWorkLinks.uploadThePlansAndRead'),
      icon: 'M6 4h9l5 5v11H6zM15 4v5h5M9 13h8M9 16h6',
    },
    {
      path: 'measurements',
      title: t('projectWorkLinks.measurements'),
      text: t('projectWorkLinks.eachElementByHandOr'),
      icon: 'M4 17 17 4l3 3L7 20H4zM8 13l2 2M11 10l2 2M14 7l2 2',
    },
    {
      path: 'phases',
      title: t('projectWorkLinks.phasesAndTasks'),
      text: t('projectWorkLinks.thePlanOfTheWork'),
      icon: 'M4 6h10M4 12h16M4 18h7M17 4v4M21 10v4M14 16v4',
    },
    {
      path: 'budgets',
      title: t('projectWorkLinks.budget'),
      text: t('projectWorkLinks.quoteTheCostAndApprove'),
      icon: 'M12 3v18M16.5 7.5C16 6 14.3 5 12 5c-2.8 0-4.5 1.3-4.5 3.2 0 4.3 9 2.4 9 6.8 0 2-1.9 3.5-4.5 3.5-2.4 0-4.2-1-4.8-2.7',
    },
    {
      path: 'expenses',
      title: t('projectWorkLinks.expenses'),
      text: t('projectWorkLinks.whatIsSpentAgainstThe'),
      icon: 'M4 7h16v12H4zM4 11h16M8 15h3',
    },
  ]
}

/** Entry points to the work of a project: blueprints, measurements, phases, tasks, budget and expenses. */
export function ProjectWorkLinks({ projectId }) {
  return (
    <section className="card">
      <h2>{t('projectWorkLinks.workOnTheProject')}</h2>
      <p className="muted">{t('projectWorkLinks.uploadThePlansRecordThe')}</p>
      <ul className="work-links">
        {sections().map((section) => (
          <li key={section.path}>
            <Link to={`/projects/${projectId}/${section.path}`} className="work-links__tile">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d={section.icon} />
              </svg>
              <strong>{section.title}</strong>
              <span>{section.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
