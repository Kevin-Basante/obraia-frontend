import { formatDate } from '../../utils/format.js'
import './PlanPreview.css'
import { t } from '../../i18n/i18n.js'

function dates(phase) {
  const days = t('planPreview.days', { count: phase.durationDays })
  if (!phase.plannedStartDate) return days
  return t('planPreview.dates', {
    start: formatDate(phase.plannedStartDate),
    end: formatDate(phase.plannedEndDate),
    days,
  })
}

/** Phases that "Create plan" would save, each one with its starting tasks. */
export function PlanPreview({ preview }) {
  const withoutDates = preview.phases.length > 0 && !preview.phases[0].plannedStartDate
  return (
    <div className="plan-preview">
      <p className="muted">
        {t('planPreview.summary', {
          type: preview.projectType,
          size: t(`planPreview.${preview.sizeCategory === 'small' ? 'small' : 'large'}`),
        })}{' '}
        <strong>{t('planPreview.phases', { count: preview.phases.length })}</strong>{' '}
        {t('planPreview.workingDays', { days: t('planPreview.days', { count: preview.workingDays }) })}
      </p>
      {withoutDates && <p className="muted">{t('planPreview.theProjectHasNoPlanned')}</p>}
      <ol className="plan-preview__list">
        {preview.phases.map((phase) => (
          <li key={phase.order}>
            <strong>{phase.name}</strong>
            <span className="muted"> · {dates(phase)}</span>
            {phase.tasks.length > 0 && <p className="plan-preview__tasks">{phase.tasks.join(' · ')}</p>}
          </li>
        ))}
      </ol>
    </div>
  )
}
