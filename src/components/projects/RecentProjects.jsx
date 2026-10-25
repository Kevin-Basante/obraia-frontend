import { Link } from 'react-router'
import { useApiData } from '../../hooks/useApiData.js'
import { listProjects } from '../../services/projectService.js'
import { StatusBadge } from './StatusBadge.jsx'
import './RecentProjects.css'

const SHOWN = 3

/** The newest projects of the user, for the dashboard. */
export function RecentProjects() {
  const projects = useApiData((signal) => listProjects({}, { signal }), [])
  const list = projects.data ?? []

  return (
    <section className="card dashboard__empty">
      <h2>Your projects</h2>
      {projects.status === 'loading' && <p className="muted">Loading…</p>}
      {projects.status === 'error' && <p className="muted">We could not load your projects: {projects.error.message}</p>}
      {projects.status === 'success' && list.length === 0 && (
        <p className="muted">You have no projects yet. Create one to plan its phases and quotation.</p>
      )}
      {list.length > 0 && (
        <ul className="recent-projects">
          {list.slice(0, SHOWN).map((project) => (
            <li key={project.id}>
              <Link to={`/projects/${project.id}`}>{project.name}</Link>
              <StatusBadge status={project.status} />
            </li>
          ))}
        </ul>
      )}
      <div className="button-row recent-projects__actions">
        <Link to="/projects/new" className="button-link">
          New project
        </Link>
        {list.length > SHOWN && <Link to="/projects">See all {list.length} projects</Link>}
        {list.length > 0 && list.length <= SHOWN && <Link to="/projects">Go to my projects</Link>}
      </div>
    </section>
  )
}
