import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { AuthCard } from '../components/AuthCard.jsx'
import { FormAlert } from '../components/FormAlert.jsx'
import { PasswordField } from '../components/PasswordField.jsx'
import { SubmitButton } from '../components/SubmitButton.jsx'
import { useFormSubmit } from '../hooks/useFormSubmit.js'
import { resetPassword } from '../services/authService.js'
import { PASSWORD_HINT, validateNewPassword } from '../utils/validation.js'

/** Opened from the email link: the user chooses a new password. */
export function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [done, setDone] = useState(false)
  const { submit, pending, error, fieldErrors, setFieldErrors } = useFormSubmit(resetPassword)

  async function handleSubmit(event) {
    event.preventDefault()
    const errors = validateNewPassword({ password, confirmPassword })
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    const response = await submit(token, password)
    if (response) setDone(true)
  }

  if (!token) {
    return (
      <AuthCard
        title="The link is incomplete"
        footer={
          <p>
            <Link to="/forgot-password">Ask for a new link</Link>
          </p>
        }
      >
        <FormAlert>Open the link again from your email.</FormAlert>
      </AuthCard>
    )
  }

  if (done) {
    return (
      <AuthCard title="Password updated" description="Sign in with your new password. Other sessions were closed.">
        <Link to="/login" className="button-link">
          Sign in
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Choose a new password"
      footer={
        <p>
          <Link to="/forgot-password">Ask for a new link</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <FormAlert>{error?.message}</FormAlert>
        <PasswordField
          label="New password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password ?? fieldErrors.newPassword}
          hint={PASSWORD_HINT}
        />
        <PasswordField
          label="Confirm new password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
        />
        <SubmitButton pending={pending} pendingText="Saving…">
          Save password
        </SubmitButton>
      </form>
    </AuthCard>
  )
}
