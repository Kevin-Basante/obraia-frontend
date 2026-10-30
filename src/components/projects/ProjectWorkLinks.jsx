import { Link } from 'react-router'

/** Entry points to the work of a project: its blueprints and measurements. */
export function ProjectWorkLinks({ projectId }) {
  return (
    <section className="card">
      <h2>Blueprints and measurements</h2>
      <p className="muted">Upload the plans of the project and record the measurements of each element.</p>
      <div className="button-row">
        <Link to={`/projects/${projectId}/blueprints`} className="button-link">
          Blueprints
        </Link>
        <Link to={`/projects/${projectId}/measurements`} className="button-link button-secondary">
          Measurements
        </Link>
      </div>
    </section>
  )
}
