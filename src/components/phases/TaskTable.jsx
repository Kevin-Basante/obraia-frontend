import { Link } from 'react-router'
import { StatusBadge } from '../projects/StatusBadge.jsx'
import { formatDate } from '../../utils/format.js'
import { formatProgress } from '../../utils/workStatus.js'
import { WorkStatusButtons } from './WorkStatusButtons.jsx'
import '../catalog/DataTable.css'
import { t } from '../../i18n/i18n.js'

function plannedDates(task) {
  if (!task.plannedStartDate && !task.plannedEndDate) return '—'
  const start = task.plannedStartDate ? formatDate(task.plannedStartDate) : '—'
  const end = task.plannedEndDate ? formatDate(task.plannedEndDate) : '—'
  return t('common.dateRange', { start, end })
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
          <th>{t('taskTable.task')}</th>
          <th>{t('taskTable.status')}</th>
          <th>{t('taskTable.plannedDates')}</th>
          <th className="data-table__number">{t('taskTable.progress')}</th>
          <th>
            <span className="visually-hidden">{t('taskTable.actions')}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td data-label={t('taskTable.task')}>
              <Link to={`/projects/${projectId}/tasks/${task.id}`}>{task.name}</Link>
            </td>
            <td data-label={t('taskTable.status')}>
              <StatusBadge status={task.status} />
              {task.late && <span className="late-tag">{t('taskTable.late')}</span>}
            </td>
            <td data-label={t('taskTable.plannedDates')}>{plannedDates(task)}</td>
            <td data-label={t('taskTable.progress')} className="data-table__number">
              {formatProgress(task.progressPct)}
            </td>
            <td data-label={t('taskTable.actions')}>
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
                      {t('taskTable.edit')}
                    </button>
                  )}
                  {onDelete && (
                    <button
                      type="button"
                      className="button-secondary button-small"
                      disabled={busy}
                      onClick={() => onDelete(task)}
                    >
                      {t('taskTable.delete')}
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
