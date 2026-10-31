import { Link } from 'react-router'
import { StatusBadge } from '../projects/StatusBadge.jsx'
import { formatDate } from '../../utils/format.js'
import { formatProgress } from '../../utils/workStatus.js'
import { WorkStatusButtons } from './WorkStatusButtons.jsx'
import '../catalog/DataTable.css'

function plannedDates(task) {
  if (!task.plannedStartDate && !task.plannedEndDate) return '—'
  const start = task.plannedStartDate ? formatDate(task.plannedStartDate) : '—'
  const end = task.plannedEndDate ? formatDate(task.plannedEndDate) : '—'
  return `${start} to ${end}`
}

/**
 * Tasks of a phase. Each one links to its progress reports. The buttons
 * are left out when the project is closed (no `onStatus`), and Edit and
 * Delete when their handler is missing.
 */
export function TaskTable({ projectId, tasks, onStatus, onEdit, onDelete, busy }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Task</th>
          <th>Status</th>
          <th>Planned dates</th>
          <th className="data-table__number">Progress</th>
          <th>
            <span className="visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td data-label="Task">
              <Link to={`/projects/${projectId}/tasks/${task.id}`}>{task.name}</Link>
            </td>
            <td data-label="Status">
              <StatusBadge status={task.status} />
              {task.late && <span className="late-tag">Late</span>}
            </td>
            <td data-label="Planned dates">{plannedDates(task)}</td>
            <td data-label="Progress" className="data-table__number">
              {formatProgress(task.progressPct)}
            </td>
            <td data-label="Actions">
              {onStatus && (
                <div className="button-row">
                  <WorkStatusButtons item={task} onChange={(code) => onStatus(task, code)} busy={busy} />
                  {onEdit && (
                    <button
                      type="button"
                      className="button-secondary button-small"
                      disabled={busy}
                      onClick={() => onEdit(task)}
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      className="button-secondary button-small"
                      disabled={busy}
                      onClick={() => onDelete(task)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
