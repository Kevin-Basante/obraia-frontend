import { Link } from 'react-router'
import { formatDate, formatQuantity } from '../../utils/format.js'
import { StatusBadge } from './StatusBadge.jsx'
import './ProjectList.css'

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
              {project.plannedStartDate ? `Starts ${formatDate(project.plannedStartDate)}` : 'No start date yet'}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
