import { useState } from 'react'
import { Link } from 'react-router'
import { AuthCard } from '../components/AuthCard.jsx'
import { FormAlert } from '../components/FormAlert.jsx'
import { FormField } from '../components/FormField.jsx'
import { SubmitButton } from '../components/SubmitButton.jsx'
import { useFormSubmit } from '../hooks/useFormSubmit.js'
import { forgotPassword } from '../services/authService.js'
import { validateEmail } from '../utils/validation.js'

/** Requests the email with the link to choose a new password. */
export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const { submit, pending, error, fieldErrors, setFieldErrors } = useFormSubmit(forgotPassword)

  async function handleSubmit(event) {
    event.preventDefault()
    const emailError = validateEmail(email)
    if (emailError) {
      setFieldErrors({ email: emailError })
      return
    }
    setSent(false)
    await submit(email.trim())
    setSent(true)
  }

  return (
    <AuthCard
      title="Forgot your password?"
      description="Enter your email and we will send you a link to choose a new one."
      footer={
        <p>
          Remembered it? <Link to="/login">Sign in</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <FormAlert>{error?.message}</FormAlert>
        {sent && !error && (
          <FormAlert type="success">If an account uses that email, the link is on its way. It expires in 30 minutes.</FormAlert>
        )}
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />
        <SubmitButton pending={pending} pendingText="Sending…">
          Send the link
        </SubmitButton>
      </form>
    </AuthCard>
  )
}
