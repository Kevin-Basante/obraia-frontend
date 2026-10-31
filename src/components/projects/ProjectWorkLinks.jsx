import { Link } from 'react-router'

/** Entry points to the work of a project: blueprints, measurements, phases, tasks and budget. */
export function ProjectWorkLinks({ projectId }) {
  return (
    <section className="card">
      <h2>Work on the project</h2>
      <p className="muted">
        Upload the plans, record the measurements of each element, follow the phases and tasks of the work and quote its cost.
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
        <Link to={`/projects/${projectId}/budgets`} className="button-link button-secondary">
          Budget
        </Link>
      </div>
    </section>
  )
}
