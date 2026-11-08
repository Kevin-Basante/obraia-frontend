import { useState } from 'react'
import { Link } from 'react-router'
import { AuthCard } from '../components/AuthCard.jsx'
import { FormAlert } from '../components/FormAlert.jsx'
import { FormField } from '../components/FormField.jsx'
import { SubmitButton } from '../components/SubmitButton.jsx'
import { useFormSubmit } from '../hooks/useFormSubmit.js'
import { forgotPassword } from '../services/authService.js'
import { validateEmail } from '../utils/validation.js'
import { t } from '../i18n/i18n.js'

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
      title={t('forgotPasswordPage.forgotYourPassword')}
      description={t('forgotPasswordPage.enterYourEmailAndWe')}
      footer={
        <p>
          {t('forgotPasswordPage.rememberedIt')} <Link to="/login">{t('forgotPasswordPage.signIn')}</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <FormAlert>{error?.message}</FormAlert>
        {sent && !error && <FormAlert type="success">{t('forgotPasswordPage.ifAnAccountUsesThat')}</FormAlert>}
        <FormField
          label={t('forgotPasswordPage.email')}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />
        <SubmitButton pending={pending} pendingText={t('forgotPasswordPage.sending')}>
          {t('forgotPasswordPage.sendTheLink')}
        </SubmitButton>
      </form>
    </AuthCard>
  )
}
