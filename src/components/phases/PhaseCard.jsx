import { useState } from 'react'
import { LineArt } from '../art/LineArt.jsx'
import { StatusBadge } from '../projects/StatusBadge.jsx'
import { phaseArt } from '../../utils/artFor.js'
import { formatDate } from '../../utils/format.js'
import { toPhaseRequest, toWorkForm, validatePhase } from '../../utils/workForm.js'
import { ProgressBar } from './ProgressBar.jsx'
import { TaskTable } from './TaskTable.jsx'
import { WorkItemForm } from './WorkItemForm.jsx'
import { WorkStatusButtons } from './WorkStatusButtons.jsx'
import './PhaseCard.css'
import { t } from '../../i18n/i18n.js'

function dateRange(start, end) {
  if (!start && !end) return null
  return t('common.dateRange', { start: start ? formatDate(start) : '—', end: end ? formatDate(end) : '—' })
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
        <div className="phase-card__art">
          <LineArt set="phase" art={phaseArt(phase.name)} />
        </div>
        <h2 id={`phase-${phase.id}`}>
          {phase.order}. {phase.name}
        </h2>
        <StatusBadge status={phase.status} />
        {phase.late && <span className="late-tag">{t('phaseCard.late')}</span>}
      </div>
      {(planned || actual) && (
        <p className="muted">
          {planned && t('phaseCard.planned', { dates: planned })}
          {planned && actual && ' · '}
          {actual && t('phaseCard.actual', { dates: actual })}
        </p>
      )}
      <ProgressBar value={phase.progressPct} label={t('progressBar.of', { name: phase.name })} />
      {actions && !editing && (
        <div className="button-row">
          <WorkStatusButtons item={phase} onChange={(code) => actions.changePhaseStatus(phase, code)} busy={busy} />
          <button type="button" className="button-secondary button-small" onClick={() => setEditing(true)}>
            {t('phaseCard.editPhase')}
          </button>
        </div>
      )}
      {editing && (
        <WorkItemForm
          initialForm={toWorkForm(phase)}
          validate={validatePhase}
          onSave={save}
          onCancel={() => setEditing(false)}
          submitText={t('phaseCard.savePhase')}
        />
      )}
      {phase.tasks.length === 0 ? (
        <p className="muted">{t('phaseCard.thisPhaseHasNoTasks')}</p>
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
