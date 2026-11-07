import { Link } from 'react-router'
import { ProgressBar } from '../phases/ProgressBar.jsx'
import { StatusBadge } from '../projects/StatusBadge.jsx'
import { shortRange } from '../../utils/dashboard.js'
import './DashboardCard.css'
import './UpcomingTasks.css'

/** The next tasks that are not done, late ones first; each one opens its progress page. */
export function UpcomingTasks({ projectId, tasks }) {
  return (
    <section className="card">
      <div className="dashboard-card__header">
        <h2>Next tasks</h2>
        <Link to={`/projects/${projectId}/phases`}>See all</Link>
      </div>
      {tasks.length === 0 ? (
        <p className="muted">There are no pending tasks.</p>
      ) : (
        <ul className="upcoming-tasks">
          {tasks.map((task) => (
            <li key={task.id}>
              <Link to={`/projects/${projectId}/tasks/${task.id}`} className="upcoming-tasks__name">
                {task.name}
              </Link>
              <span className="upcoming-tasks__meta">
                <StatusBadge status={task.status} />
                {task.late && <span className="dashboard-late">Late</span>}
                <span>{task.phaseName}</span>
              </span>
              <span className="upcoming-tasks__meta">
                {shortRange(task.plannedStartDate, task.plannedEndDate) ?? 'No dates'}
              </span>
              <ProgressBar value={task.progressPct} label={`Progress of ${task.name}`} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
