import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { AuthCard } from '../components/AuthCard.jsx'
import { FormAlert } from '../components/FormAlert.jsx'
import { PasswordField } from '../components/PasswordField.jsx'
import { SubmitButton } from '../components/SubmitButton.jsx'
import { useFormSubmit } from '../hooks/useFormSubmit.js'
import { resetPassword } from '../services/authService.js'
import { passwordHint, validateNewPassword } from '../utils/validation.js'
import { t } from '../i18n/i18n.js'

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
        title={t('resetPasswordPage.theLinkIsIncomplete')}
        footer={
          <p>
            <Link to="/forgot-password">{t('resetPasswordPage.askForANewLink')}</Link>
          </p>
        }
      >
        <FormAlert>{t('resetPasswordPage.openTheLinkAgainFrom')}</FormAlert>
      </AuthCard>
    )
  }

  if (done) {
    return (
      <AuthCard title={t('resetPasswordPage.passwordUpdated')} description={t('resetPasswordPage.signInWithYourNew')}>
        <Link to="/login" className="button-link">
          {t('resetPasswordPage.signIn')}
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title={t('resetPasswordPage.chooseANewPassword')}
      footer={
        <p>
          <Link to="/forgot-password">{t('resetPasswordPage.askForANewLink')}</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <FormAlert>{error?.message}</FormAlert>
        <PasswordField
          label={t('resetPasswordPage.newPassword')}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldErrors.password ?? fieldErrors.newPassword}
          hint={passwordHint()}
        />
        <PasswordField
          label={t('resetPasswordPage.confirmNewPassword')}
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={fieldErrors.confirmPassword}
        />
        <SubmitButton pending={pending} pendingText={t('resetPasswordPage.saving')}>
          {t('resetPasswordPage.savePassword')}
        </SubmitButton>
      </form>
    </AuthCard>
  )
}
