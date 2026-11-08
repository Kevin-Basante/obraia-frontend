import { useCallback, useState } from 'react'
import { useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { FormAlert } from '../../components/FormAlert.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { DeletionImpact } from '../../components/projects/DeletionImpact.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { getDeletionImpact, requestDeletion } from '../../services/deletionService.js'
import { NotFoundPage } from '../NotFoundPage.jsx'
import { serverMessage } from '../../utils/serverMessage.js'
import { t } from '../../i18n/i18n.js'

/**
 * First step of the deletion: shows the warnings and sends the email.
 * The project is deleted only when the user opens the link in that email.
 */
export function DeleteProjectPage() {
  const { id } = useParams()
  const [understood, setUnderstood] = useState(false)
  const impact = useApiData((signal) => getDeletionImpact(id, { signal }), [id])
  const send = useCallback(() => requestDeletion(id), [id])
  const { submit, pending, error } = useFormSubmit(send)
  const [sent, setSent] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()
    const response = await submit()
    if (response) setSent(serverMessage(response))
  }

  if (impact.error?.status === 404) return <NotFoundPage />
  if (impact.status === 'error') return <ErrorState error={impact.error} onRetry={impact.retry} />
  if (!impact.data) return <LoadingState title={t('deleteProjectPage.checkingWhatTheProjectHolds')} />

  const back = { to: `/projects/${id}`, label: impact.data.projectName }

  return (
    <div className="workspace">
      <PageHeader title={t('deleteProjectPage.deleteProject')} back={back} />
      <DeletionImpact impact={impact.data} />
      <form className="card" onSubmit={handleSubmit}>
        {sent ? (
          <FormAlert type="success">{t('serverMessages.withLink', { message: sent })}</FormAlert>
        ) : (
          <>
            <label className="checkbox-field">
              <input type="checkbox" checked={understood} onChange={(e) => setUnderstood(e.target.checked)} />
              {t('deleteProjectPage.understand')}
            </label>
            <FormAlert>{error?.message}</FormAlert>
            <div className="button-row">
              <button type="submit" className="button-danger" disabled={!understood || pending}>
                {pending ? t('deleteProjectPage.sending') : t('deleteProjectPage.emailMeTheConfirmationLink')}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
