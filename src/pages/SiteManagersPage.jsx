import { useCallback, useState } from 'react'
import { ErrorState } from '../components/ErrorState.jsx'
import { FormAlert } from '../components/FormAlert.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { PageHeader } from '../components/PageHeader.jsx'
import { SiteManagerForm } from '../components/siteManagers/SiteManagerForm.jsx'
import { useApiData } from '../hooks/useApiData.js'
import { useFormSubmit } from '../hooks/useFormSubmit.js'
import {
  createSiteManager,
  deleteSiteManager,
  listSiteManagers,
  updateSiteManager,
} from '../services/siteManagerService.js'
import { EMPTY_SITE_MANAGER_FORM, toSiteManagerForm } from '../utils/siteManagerForm.js'
import './SiteManagersPage.css'

/** The user's site managers: add, edit and delete the contacts assigned to projects. */
export function SiteManagersPage() {
  const [editingId, setEditingId] = useState(null)
  const managers = useApiData((signal) => listSiteManagers({ signal }), [])
  const { retry } = managers

  const create = useCallback(
    async (request) => {
      const saved = await createSiteManager(request)
      retry()
      return saved
    },
    [retry],
  )
  const remove = useCallback((id) => deleteSiteManager(id).then(retry), [retry])
  const removing = useFormSubmit(remove)

  async function update(request) {
    const saved = await updateSiteManager(editingId, request)
    setEditingId(null)
    retry()
    return saved
  }

  function handleDelete(manager) {
    const question = `Delete ${manager.fullName}? Their projects will have no site manager.`
    if (window.confirm(question)) removing.submit(manager.id)
  }

  return (
    <div className="workspace">
      <PageHeader
        title="My site managers"
        description="People in charge of the work on site. Assign them from each project page."
        back={{ to: '/projects', label: 'My projects' }}
      />
      <section className="card">
        <h2>Add a site manager</h2>
        <SiteManagerForm initialForm={EMPTY_SITE_MANAGER_FORM} onSave={create} submitText="Add" />
      </section>

      {managers.status === 'error' && <ErrorState error={managers.error} onRetry={retry} />}
      {managers.status === 'loading' && !managers.data && <LoadingState title="Loading your site managers…" />}
      {managers.data && (
        <section className="card">
          <h2>Saved ({managers.data.length})</h2>
          <FormAlert>{removing.error?.message}</FormAlert>
          {managers.data.length === 0 ? (
            <p className="muted">You have not saved any site manager yet.</p>
          ) : (
            <ul className="site-manager-list">
              {managers.data.map((manager) =>
                manager.id === editingId ? (
                  <li key={manager.id}>
                    <SiteManagerForm
                      initialForm={toSiteManagerForm(manager)}
                      onSave={update}
                      onCancel={() => setEditingId(null)}
                      submitText="Save"
                    />
                  </li>
                ) : (
                  <li key={manager.id} className="site-manager-list__row">
                    <span>
                      <strong>{manager.fullName}</strong>
                      <span className="muted">
                        {[manager.documentNumber && `Doc. ${manager.documentNumber}`, manager.phone]
                          .filter(Boolean)
                          .map((text) => ` · ${text}`)}
                      </span>
                    </span>
                    <span className="button-row">
                      <button type="button" className="button-secondary" onClick={() => setEditingId(manager.id)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="button-secondary"
                        disabled={removing.pending}
                        onClick={() => handleDelete(manager)}
                      >
                        Delete
                      </button>
                    </span>
                  </li>
                ),
              )}
            </ul>
          )}
        </section>
      )}
    </div>
  )
}
