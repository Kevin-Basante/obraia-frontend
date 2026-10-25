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
    if (response) setSent(response.message)
  }

  if (impact.error?.status === 404) return <NotFoundPage />
  if (impact.status === 'error') return <ErrorState error={impact.error} onRetry={impact.retry} />
  if (!impact.data) return <LoadingState title="Checking what the project holds…" />

  const back = { to: `/projects/${id}`, label: impact.data.projectName }

  return (
    <div className="workspace">
      <PageHeader title="Delete project" back={back} />
      <DeletionImpact impact={impact.data} />
      <form className="card" onSubmit={handleSubmit}>
        {sent ? (
          <FormAlert type="success">{sent}. Open the link in that email to finish.</FormAlert>
        ) : (
          <>
            <label className="checkbox-field">
              <input type="checkbox" checked={understood} onChange={(e) => setUnderstood(e.target.checked)} />I
              understand that this deletes the project for every member.
            </label>
            <FormAlert>{error?.message}</FormAlert>
            <div className="button-row">
              <button type="submit" className="button-danger" disabled={!understood || pending}>
                {pending ? 'Sending…' : 'Email me the confirmation link'}
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  )
}
