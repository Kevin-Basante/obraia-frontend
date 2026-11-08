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
import { t } from '../i18n/i18n.js'

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
    const question = t('siteManagersPage.confirmDelete', { name: manager.fullName })
    if (window.confirm(question)) removing.submit(manager.id)
  }

  return (
    <div className="workspace">
      <PageHeader
        title={t('siteManagersPage.mySiteManagers')}
        description={t('siteManagersPage.peopleInChargeOfThe')}
        back={{ to: '/projects', label: t('siteManagersPage.myProjects') }}
      />
      <section className="card">
        <h2>{t('siteManagersPage.addASiteManager')}</h2>
        <SiteManagerForm initialForm={EMPTY_SITE_MANAGER_FORM} onSave={create} submitText={t('siteManagersPage.add')} />
      </section>

      {managers.status === 'error' && <ErrorState error={managers.error} onRetry={retry} />}
      {managers.status === 'loading' && !managers.data && (
        <LoadingState title={t('siteManagersPage.loadingYourSiteManagers')} />
      )}
      {managers.data && (
        <section className="card">
          <h2>Saved ({managers.data.length})</h2>
          <FormAlert>{removing.error?.message}</FormAlert>
          {managers.data.length === 0 ? (
            <p className="muted">{t('siteManagersPage.youHaveNotSavedAny')}</p>
          ) : (
            <ul className="site-manager-list">
              {managers.data.map((manager) =>
                manager.id === editingId ? (
                  <li key={manager.id}>
                    <SiteManagerForm
                      initialForm={toSiteManagerForm(manager)}
                      onSave={update}
                      onCancel={() => setEditingId(null)}
                      submitText={t('siteManagersPage.save')}
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
                        {t('siteManagersPage.edit')}
                      </button>
                      <button
                        type="button"
                        className="button-secondary"
                        disabled={removing.pending}
                        onClick={() => handleDelete(manager)}
                      >
                        {t('siteManagersPage.delete')}
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
