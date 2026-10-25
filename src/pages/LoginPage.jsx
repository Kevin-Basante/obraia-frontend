import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { AuthCard } from '../components/AuthCard.jsx'
import { FormAlert } from '../components/FormAlert.jsx'
import { FormField } from '../components/FormField.jsx'
import { PasswordField } from '../components/PasswordField.jsx'
import { SubmitButton } from '../components/SubmitButton.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useFormSubmit } from '../hooks/useFormSubmit.js'
import { validateEmail } from '../utils/validation.js'

/** Sign-in form. An unverified account gets a link to resend the email. */
export function LoginPage() {
  const { signIn, continueAsGuest } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { submit, pending, error, fieldErrors, setFieldErrors } = useFormSubmit(signIn)

  const destination = location.state?.from ?? '/dashboard'

  async function handleSubmit(event) {
    event.preventDefault()
    const errors = {}
    const emailError = validateEmail(email)
    if (emailError) errors.email = emailError
    if (!password) errors.password = 'Enter your password'
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    const user = await submit(email.trim(), password)
    if (user) navigate(destination, { replace: true })
  }

  function tryAsGuest() {
    continueAsGuest()
    navigate('/dashboard')
  }

  return (
    <AuthCard
      title="Sign in"
      description="Welcome back to ObraIA."
      footer={
        <>
          <p>
            <Link to="/forgot-password">Forgot your password?</Link>
          </p>
          <p>
            New to ObraIA? <Link to="/register">Create an account</Link>
          </p>
          <button type="button" className="button-secondary" onClick={tryAsGuest}>
            Continue as guest
          </button>
        </>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <FormAlert>{error?.message}</FormAlert>
        {error?.code === 'EMAIL_NOT_VERIFIED' && (
          <p className="auth-form__note">
            <Link to="/check-email" state={{ email: email.trim() }}>
              Send me the verification email again
            </Link>
          </p>
        )}
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />
        <PasswordField
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password}
        />
        <SubmitButton pending={pending} pendingText="Signing in…">
          Sign in
        </SubmitButton>
      </form>
    </AuthCard>
  )
}
