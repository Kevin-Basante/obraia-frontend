import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import { FormAlert } from '../FormAlert.jsx'
import { SelectField } from '../SelectField.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { assignSiteManager, unassignSiteManager } from '../../services/projectService.js'
import { listSiteManagers } from '../../services/siteManagerService.js'
import { t } from '../../i18n/i18n.js'

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
      <h2>{t('siteManagerPanel.siteManager')}</h2>
      {current ? (
        <p>
          <strong>{current.fullName}</strong>
          {current.phone && <span className="muted"> · {current.phone}</span>}
        </p>
      ) : (
        <p className="muted">{t('siteManagerPanel.noSiteManagerAssigned')}</p>
      )}
      {!readOnly && (
        <>
          {managers.data && managers.data.length === 0 ? (
            <p className="muted">
              {t('siteManagerPanel.youHaveNoSavedSite')} <Link to="/site-managers">{t('siteManagerPanel.addOne')}</Link>
              .
            </p>
          ) : (
            <form className="inline-form" onSubmit={handleAssign}>
              <SelectField
                label={current ? t('siteManagerPanel.changeTo') : t('siteManagerPanel.assign')}
                placeholder={
                  managers.status === 'loading'
                    ? t('siteManagerPanel.loading')
                    : t('siteManagerPanel.chooseASiteManager')
                }
                options={options}
                value={selected}
                onChange={(event) => setSelected(event.target.value)}
              />
              <button type="submit" disabled={pending || !selected}>
                {t('siteManagerPanel.assign')}
              </button>
            </form>
          )}
          <div className="button-row">
            {current && (
              <button type="button" className="button-secondary" disabled={pending} onClick={() => submit(null)}>
                {t('siteManagerPanel.removeSiteManager')}
              </button>
            )}
            <Link to="/site-managers">{t('siteManagerPanel.manageMySiteManagers')}</Link>
          </div>
        </>
      )}
      <FormAlert>{(managers.error ?? error)?.message}</FormAlert>
    </section>
  )
}
