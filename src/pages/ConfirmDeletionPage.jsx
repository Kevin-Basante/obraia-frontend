import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { AuthCard } from '../components/AuthCard.jsx'
import { FormAlert } from '../components/FormAlert.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { confirmDeletion } from '../services/deletionService.js'

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
      .then((response) => active && setResult({ status: 'success', message: response.message }))
      .catch((error) => active && setResult({ status: 'error', error }))
    return () => {
      active = false
    }
  }, [token])

  if (result.status === 'loading') return <LoadingState title="Deleting the project…" message="One moment." />

  if (result.status === 'success') {
    return (
      <AuthCard title="Project deleted" description={result.message}>
        <Link to="/projects" className="button-link">
          Go to my projects
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="We could not delete the project"
      footer={
        <p>
          You can ask for a new link from the project page. <Link to="/projects">My projects</Link>
        </p>
      }
    >
      <FormAlert>
        {result.status === 'missing' ? 'The link is incomplete. Open it again from your email.' : result.error.message}
      </FormAlert>
    </AuthCard>
  )
}
