import { useCallback } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { changeProjectStatus } from '../../services/projectService.js'
import { needsConfirmation, statusActionLabel } from '../../utils/projectStatus.js'
import { StatusBadge } from './StatusBadge.jsx'
import { codeLabel, t } from '../../i18n/i18n.js'

/** Current status and one button per status the project can move to. */
export function StatusActions({ project, onChanged }) {
  const change = useCallback((code) => changeProjectStatus(project.id, code).then(onChanged), [project.id, onChanged])
  const { submit, pending, error } = useFormSubmit(change)

  function handleClick(code, label) {
    const question = t('statusActions.confirm', { status: label.toLowerCase() })
    if (needsConfirmation(code) && !window.confirm(question)) {
      return
    }
    submit(code)
  }

  return (
    <section className="card">
      <h2>
        {t('statusActions.status')} <StatusBadge status={project.status} />
      </h2>
      {project.nextStatuses.length === 0 ? (
        <p className="muted">{t('statusActions.thisProjectIsClosedIts')}</p>
      ) : (
        <div className="button-row">
          {project.nextStatuses.map((next) => (
            <button
              key={next.code}
              type="button"
              className={next.code === 'cancelled' ? 'button-secondary' : undefined}
              disabled={pending}
              onClick={() => handleClick(next.code, codeLabel('status', next))}
            >
              {statusActionLabel(next.code)}
            </button>
          ))}
        </div>
      )}
      <FormAlert>{error?.message}</FormAlert>
    </section>
  )
}
