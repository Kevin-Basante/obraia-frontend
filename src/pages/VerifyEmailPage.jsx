import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { AuthCard } from '../components/AuthCard.jsx'
import { FormAlert } from '../components/FormAlert.jsx'
import { LoadingState } from '../components/LoadingState.jsx'
import { verifyEmail } from '../services/authService.js'

// A token works only once. React can run the effect twice in development,
// so both runs share the same request instead of the second one failing.
const requests = new Map()

function verifyOnce(token) {
  if (!requests.has(token)) requests.set(token, verifyEmail(token))
  return requests.get(token)
}

/** Opened from the email link: sends the token to the backend and shows the result. */
export function VerifyEmailPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [result, setResult] = useState(token ? { status: 'loading' } : { status: 'missing' })

  useEffect(() => {
    if (!token) return undefined
    let active = true
    verifyOnce(token)
      .then(() => active && setResult({ status: 'success' }))
      .catch((error) => active && setResult({ status: 'error', error }))
    return () => {
      active = false
    }
  }, [token])

  if (result.status === 'loading') return <LoadingState title="Verifying your email…" message="One moment." />

  if (result.status === 'success') {
    return (
      <AuthCard title="Email verified" description="Your account is active. You can sign in now.">
        <Link to="/login" className="button-link">
          Sign in
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="We could not verify your email"
      footer={
        <p>
          <Link to="/check-email">Send me a new link</Link>
        </p>
      }
    >
      <FormAlert>
        {result.status === 'missing' ? 'The link is incomplete. Open it again from your email.' : result.error.message}
      </FormAlert>
    </AuthCard>
  )
}
