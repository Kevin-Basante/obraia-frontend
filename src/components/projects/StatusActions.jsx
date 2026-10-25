import { useCallback } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { changeProjectStatus } from '../../services/projectService.js'
import { needsConfirmation, statusActionLabel } from '../../utils/projectStatus.js'
import { StatusBadge } from './StatusBadge.jsx'

/** Current status and one button per status the project can move to. */
export function StatusActions({ project, onChanged }) {
  const change = useCallback(
    (code) => changeProjectStatus(project.id, code).then(onChanged),
    [project.id, onChanged],
  )
  const { submit, pending, error } = useFormSubmit(change)

  function handleClick(code, label) {
    const question = `Mark this project as ${label.toLowerCase()}? It cannot be changed afterwards.`
    if (needsConfirmation(code) && !window.confirm(question)) {
      return
    }
    submit(code)
  }

  return (
    <section className="card">
      <h2>
        Status <StatusBadge status={project.status} />
      </h2>
      {project.nextStatuses.length === 0 ? (
        <p className="muted">This project is closed: its data can be read but no longer changed.</p>
      ) : (
        <div className="button-row">
          {project.nextStatuses.map((next) => (
            <button
              key={next.code}
              type="button"
              className={next.code === 'cancelled' ? 'button-secondary' : undefined}
              disabled={pending}
              onClick={() => handleClick(next.code, next.label)}
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
