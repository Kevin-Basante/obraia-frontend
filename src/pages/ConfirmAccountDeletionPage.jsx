import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { AuthCard } from '../components/AuthCard.jsx'
import { FormAlert } from '../components/FormAlert.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { confirmAccountDeletion } from '../services/accountService.js'

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
        setResult({ status: 'success', message: response.message })
      })
      .catch((error) => active && setResult({ status: 'error', error }))
    return () => {
      active = false
    }
  }, [token, signOut])

  if (result.status === 'loading') return <LoadingState title="Deleting your account…" message="One moment." />

  if (result.status === 'success') {
    return (
      <AuthCard title="Account deleted" description={result.message}>
        <Link to="/" className="button-link">
          Go to the home page
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="We could not delete your account"
      footer={
        <p>
          You can ask for a new link from your account page. <Link to="/account">My account</Link>
        </p>
      }
    >
      <FormAlert>
        {result.status === 'missing' ? 'The link is incomplete. Open it again from your email.' : result.error.message}
      </FormAlert>
    </AuthCard>
  )
}
