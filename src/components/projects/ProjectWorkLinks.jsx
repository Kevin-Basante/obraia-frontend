import { Link } from 'react-router'

/** Entry points to the work of a project: blueprints, measurements, phases and tasks. */
export function ProjectWorkLinks({ projectId }) {
  return (
    <section className="card">
      <h2>Work on the project</h2>
      <p className="muted">
        Upload the plans, record the measurements of each element and follow the phases and tasks of the work.
      </p>
      <div className="button-row">
        <Link to={`/projects/${projectId}/blueprints`} className="button-link">
          Blueprints
        </Link>
        <Link to={`/projects/${projectId}/measurements`} className="button-link button-secondary">
          Measurements
        </Link>
        <Link to={`/projects/${projectId}/phases`} className="button-link button-secondary">
          Phases and tasks
        </Link>
      </div>
    </section>
  )
}
