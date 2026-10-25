import { formatDate, formatQuantity } from '../../utils/format.js'
import './ProjectSummary.css'

function dateOrDash(date) {
  return date ? formatDate(date) : '—'
}

/** Main data of a project as a list of label and value. */
export function ProjectSummary({ project }) {
  const rows = [
    ['Project type', project.projectType.name],
    ['City', `${project.location.city}, ${project.location.department}`],
    ['Address', project.address ?? '—'],
    ['Built area', `${formatQuantity(project.builtAreaM2)} m² (${project.sizeCategory === 'small' ? 'small' : 'large'})`],
    ['Floors', project.floors],
    ['Planned dates', `${dateOrDash(project.plannedStartDate)} to ${dateOrDash(project.plannedEndDate)}`],
    ['Actual dates', `${dateOrDash(project.actualStartDate)} to ${dateOrDash(project.actualEndDate)}`],
  ]

  return (
    <section className="card">
      <h2>Details</h2>
      <dl className="project-summary">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
