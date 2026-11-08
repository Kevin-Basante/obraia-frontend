import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { AuthCard } from '../components/AuthCard.jsx'
import { FormAlert } from '../components/FormAlert.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { confirmAccountDeletion } from '../services/accountService.js'
import { serverMessage } from '../utils/serverMessage.js'
import { t } from '../i18n/i18n.js'

// A link works only once, so both runs of the effect in development share the request.
const requests = new Map()

function confirmOnce(token) {
  if (!requests.has(token)) requests.set(token, confirmAccountDeletion(token))
  return requests.get(token)
}

/** Opened from the deletion email: deletes the account and closes the session in this browser. */
export function ConfirmAccountDeletionPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { signOut } = useAuth()
  const [result, setResult] = useState(token ? { status: 'loading' } : { status: 'missing' })

  useEffect(() => {
    if (!token) return undefined
    let active = true
    confirmOnce(token)
      .then((response) => {
        if (!active) return
        // The account no longer exists, so the saved session is useless.
        signOut()
        setResult({ status: 'success', message: serverMessage(response) })
      })
      .catch((error) => active && setResult({ status: 'error', error }))
    return () => {
      active = false
    }
  }, [token, signOut])

  if (result.status === 'loading')
    return (
      <LoadingState
        title={t('confirmAccountDeletionPage.deletingYourAccount')}
        message={t('confirmAccountDeletionPage.oneMoment')}
      />
    )

  if (result.status === 'success') {
    return (
      <AuthCard title={t('confirmAccountDeletionPage.accountDeleted')} description={result.message}>
        <Link to="/" className="button-link">
          {t('confirmAccountDeletionPage.goToTheHomePage')}
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title={t('confirmAccountDeletionPage.weCouldNotDeleteYour')}
      footer={
        <p>
          {t('confirmAccountDeletionPage.youCanAskForA')}{' '}
          <Link to="/account">{t('confirmAccountDeletionPage.myAccount')}</Link>
        </p>
      }
    >
      <FormAlert>
        {result.status === 'missing' ? t('confirmAccountDeletionPage.theLinkIsIncompleteOpen') : result.error.message}
      </FormAlert>
    </AuthCard>
  )
}
