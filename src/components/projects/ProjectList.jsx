import { Link } from 'react-router'
import { formatDate, formatQuantity } from '../../utils/format.js'
import { StatusBadge } from './StatusBadge.jsx'
import './ProjectList.css'
import { t } from '../../i18n/i18n.js'

/** Projects as cards; each one opens the project page. */
export function ProjectList({ projects, updating }) {
  return (
    <ul className={`project-list${updating ? ' project-list--updating' : ''}`}>
      {projects.map((project) => (
        <li key={project.id}>
          <Link to={`/projects/${project.id}`} className="project-list__card">
            <span className="project-list__top">
              <strong>{project.name}</strong>
              <StatusBadge status={project.status} />
            </span>
            <span className="muted">
              {project.projectTypeName} · {project.city}
            </span>
            <span className="muted">
              {formatQuantity(project.builtAreaM2)} m² ·{' '}
              {project.plannedStartDate
                ? t('projectList.starts', { date: formatDate(project.plannedStartDate) })
                : t('projectList.noStartDateYet')}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
