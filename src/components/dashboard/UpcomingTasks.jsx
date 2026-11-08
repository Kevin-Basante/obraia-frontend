import { Link } from 'react-router'
import { ProgressBar } from '../phases/ProgressBar.jsx'
import { StatusBadge } from '../projects/StatusBadge.jsx'
import { shortRange } from '../../utils/dashboard.js'
import './DashboardCard.css'
import './UpcomingTasks.css'
import { t } from '../../i18n/i18n.js'

/** The next tasks that are not done, late ones first; each one opens its progress page. */
export function UpcomingTasks({ projectId, tasks }) {
  return (
    <section className="card">
      <div className="dashboard-card__header">
        <h2>{t('upcomingTasks.nextTasks')}</h2>
        <Link to={`/projects/${projectId}/phases`}>{t('upcomingTasks.seeAll')}</Link>
      </div>
      {tasks.length === 0 ? (
        <p className="muted">{t('upcomingTasks.thereAreNoPendingTasks')}</p>
      ) : (
        <ul className="upcoming-tasks">
          {tasks.map((task) => (
            <li key={task.id}>
              <Link to={`/projects/${projectId}/tasks/${task.id}`} className="upcoming-tasks__name">
                {task.name}
              </Link>
              <span className="upcoming-tasks__meta">
                <StatusBadge status={task.status} />
                {task.late && <span className="dashboard-late">{t('upcomingTasks.late')}</span>}
                <span>{task.phaseName}</span>
              </span>
              <span className="upcoming-tasks__meta">
                {shortRange(task.plannedStartDate, task.plannedEndDate) ?? t('upcomingTasks.noDates')}
              </span>
              <ProgressBar value={task.progressPct} label={t('progressBar.of', { name: task.name })} />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
