import { useState } from 'react'
import { StatusBadge } from '../projects/StatusBadge.jsx'
import { formatDate } from '../../utils/format.js'
import { toPhaseRequest, toWorkForm, validatePhase } from '../../utils/workForm.js'
import { ProgressBar } from './ProgressBar.jsx'
import { TaskTable } from './TaskTable.jsx'
import { WorkItemForm } from './WorkItemForm.jsx'
import { WorkStatusButtons } from './WorkStatusButtons.jsx'
import './PhaseCard.css'

function dateRange(start, end) {
  if (!start && !end) return null
  return `${start ? formatDate(start) : '—'} to ${end ? formatDate(end) : '—'}`
}

/**
 * One phase of the plan: status, dates, progress and its tasks. Without
 * `actions` (closed project) everything can be read but not changed.
 */
export function PhaseCard({ projectId, phase, actions, busy }) {
  const [editing, setEditing] = useState(false)
  const planned = dateRange(phase.plannedStartDate, phase.plannedEndDate)
  const actual = dateRange(phase.actualStartDate, phase.actualEndDate)

  async function save(form) {
    await actions.savePhase(phase, toPhaseRequest(form))
    setEditing(false)
  }

  return (
    <section className="card phase-card" aria-labelledby={`phase-${phase.id}`}>
      <div className="phase-card__header">
        <h2 id={`phase-${phase.id}`}>
          {phase.order}. {phase.name}
        </h2>
        <StatusBadge status={phase.status} />
        {phase.late && <span className="late-tag">Late</span>}
      </div>
      {(planned || actual) && (
        <p className="muted">
          {planned && `Planned: ${planned}`}
          {planned && actual && ' · '}
          {actual && `Actual: ${actual}`}
        </p>
      )}
      <ProgressBar value={phase.progressPct} label={`Progress of ${phase.name}`} />
      {actions && !editing && (
        <div className="button-row">
          <WorkStatusButtons item={phase} onChange={(code) => actions.changePhaseStatus(phase, code)} busy={busy} />
          <button type="button" className="button-secondary button-small" onClick={() => setEditing(true)}>
            Edit phase
          </button>
        </div>
      )}
      {editing && (
        <WorkItemForm
          initialForm={toWorkForm(phase)}
          validate={validatePhase}
          onSave={save}
          onCancel={() => setEditing(false)}
          submitText="Save phase"
        />
      )}
      {phase.tasks.length === 0 ? (
        <p className="muted">This phase has no tasks.</p>
      ) : (
        <TaskTable
          projectId={projectId}
          tasks={phase.tasks}
          onStatus={actions?.changeTaskStatus}
          onEdit={actions?.editTask}
          onDelete={actions?.deleteTask}
          busy={busy}
        />
      )}
    </section>
  )
}
