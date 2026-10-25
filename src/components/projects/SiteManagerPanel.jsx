import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { FormAlert } from '../FormAlert.jsx'
import { SelectField } from '../SelectField.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { assignSiteManager, unassignSiteManager } from '../../services/projectService.js'
import { listSiteManagers } from '../../services/siteManagerService.js'

/** Site manager of the project, chosen from the contacts the user saved. */
export function SiteManagerPanel({ project, readOnly, onChanged }) {
  const [selected, setSelected] = useState('')
  const managers = useApiData((signal) => listSiteManagers({ signal }), [])
  const save = useCallback(
    (siteManagerId) =>
      (siteManagerId ? assignSiteManager(project.id, siteManagerId) : unassignSiteManager(project.id)).then(onChanged),
    [project.id, onChanged],
  )
  const { submit, pending, error } = useFormSubmit(save)

  const current = project.siteManager
  const options = (managers.data ?? [])
    .filter((manager) => manager.id !== current?.id)
    .map((manager) => ({ value: manager.id, label: manager.fullName }))

  async function handleAssign(event) {
    event.preventDefault()
    if (!selected) return
    await submit(selected)
    setSelected('')
  }

  return (
    <section className="card">
      <h2>Site manager</h2>
      {current ? (
        <p>
          <strong>{current.fullName}</strong>
          {current.phone && <span className="muted"> · {current.phone}</span>}
        </p>
      ) : (
        <p className="muted">No site manager assigned.</p>
      )}
      {!readOnly && (
        <>
          {managers.data && managers.data.length === 0 ? (
            <p className="muted">
              You have no saved site managers yet. <Link to="/site-managers">Add one</Link>.
            </p>
          ) : (
            <form className="inline-form" onSubmit={handleAssign}>
              <SelectField
                label={current ? 'Change to' : 'Assign'}
                placeholder={managers.status === 'loading' ? 'Loading…' : 'Choose a site manager'}
                options={options}
                value={selected}
                onChange={(event) => setSelected(event.target.value)}
              />
              <button type="submit" disabled={pending || !selected}>
                Assign
              </button>
            </form>
          )}
          <div className="button-row">
            {current && (
              <button type="button" className="button-secondary" disabled={pending} onClick={() => submit(null)}>
                Remove site manager
              </button>
            )}
            <Link to="/site-managers">Manage my site managers</Link>
          </div>
        </>
      )}
      <FormAlert>{(managers.error ?? error)?.message}</FormAlert>
    </section>
  )
}
