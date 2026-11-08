import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { AuthCard } from '../components/AuthCard.jsx'
import { FormAlert } from '../components/FormAlert.jsx'
import { FormField } from '../components/FormField.jsx'
import { SubmitButton } from '../components/SubmitButton.jsx'
import { useFormSubmit } from '../hooks/useFormSubmit.js'
import { resendVerification } from '../services/authService.js'
import { validateEmail } from '../utils/validation.js'
import { t } from '../i18n/i18n.js'

/** Asks the user to open the verification link and lets them request it again. */
export function CheckEmailPage() {
  const location = useLocation()
  const [email, setEmail] = useState(location.state?.email ?? '')
  const [sent, setSent] = useState(false)
  const { submit, pending, error, fieldErrors, setFieldErrors } = useFormSubmit(resendVerification)

  async function handleSubmit(event) {
    event.preventDefault()
    const emailError = validateEmail(email)
    if (emailError) {
      setFieldErrors({ email: emailError })
      return
    }
    setSent(false)
    // The endpoint answers 202 with no body, so success is "no error".
    await submit(email.trim())
    setSent(true)
  }

  return (
    <AuthCard
      title={t('checkEmailPage.checkYourEmail')}
      description={t('checkEmailPage.weSentYouALink')}
      footer={
        <p>
          {t('checkEmailPage.alreadyConfirmed')} <Link to="/login">{t('checkEmailPage.signIn')}</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <FormAlert>{error?.message}</FormAlert>
        {sent && !error && <FormAlert type="success">{t('checkEmailPage.ifTheAccountExistsAnd')}</FormAlert>}
        <FormField
          label={t('checkEmailPage.email')}
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fieldErrors.email}
        />
        <SubmitButton pending={pending} pendingText={t('checkEmailPage.sending')}>
          {t('checkEmailPage.resendTheEmail')}
        </SubmitButton>
      </form>
    </AuthCard>
  )
}
