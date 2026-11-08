import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { AuthCard } from '../components/AuthCard.jsx'
import { FormAlert } from '../components/FormAlert.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { confirmDeletion } from '../services/deletionService.js'
import { serverMessage } from '../utils/serverMessage.js'
import { t } from '../i18n/i18n.js'

// A link works only once, so both runs of the effect in development share the request.
const requests = new Map()

function confirmOnce(token) {
  if (!requests.has(token)) requests.set(token, confirmDeletion(token))
  return requests.get(token)
}

/** Opened from the deletion email: confirms it and shows when the data disappears for good. */
export function ConfirmDeletionPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [result, setResult] = useState(token ? { status: 'loading' } : { status: 'missing' })

  useEffect(() => {
    if (!token) return undefined
    let active = true
    confirmOnce(token)
      .then((response) => active && setResult({ status: 'success', message: serverMessage(response) }))
      .catch((error) => active && setResult({ status: 'error', error }))
    return () => {
      active = false
    }
  }, [token])

  if (result.status === 'loading')
    return (
      <LoadingState title={t('confirmDeletionPage.deletingTheProject')} message={t('confirmDeletionPage.oneMoment')} />
    )

  if (result.status === 'success') {
    return (
      <AuthCard title={t('confirmDeletionPage.projectDeleted')} description={result.message}>
        <Link to="/projects" className="button-link">
          {t('confirmDeletionPage.goToMyProjects')}
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title={t('confirmDeletionPage.weCouldNotDeleteThe')}
      footer={
        <p>
          {t('confirmDeletionPage.youCanAskForA')} <Link to="/projects">{t('confirmDeletionPage.myProjects')}</Link>
        </p>
      }
    >
      <FormAlert>
        {result.status === 'missing' ? t('confirmDeletionPage.theLinkIsIncompleteOpen') : result.error.message}
      </FormAlert>
    </AuthCard>
  )
}
