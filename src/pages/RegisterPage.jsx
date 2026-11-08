import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { AuthCard } from '../components/AuthCard.jsx'
import { FormAlert } from '../components/FormAlert.jsx'
import { FormField } from '../components/FormField.jsx'
import { PasswordField } from '../components/PasswordField.jsx'
import { SubmitButton } from '../components/SubmitButton.jsx'
import { useFormSubmit } from '../hooks/useFormSubmit.js'
import { register } from '../services/authService.js'
import { passwordHint, validateRegistration } from '../utils/validation.js'
import { t } from '../i18n/i18n.js'

const EMPTY_FORM = { firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' }

/** Account creation. After registering, the user must confirm the email. */
export function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const { submit, pending, error, fieldErrors, setFieldErrors } = useFormSubmit(register)

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const errors = validateRegistration(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    const email = form.email.trim()
    const response = await submit({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email,
      phone: form.phone.trim(),
      password: form.password,
    })
    if (response) navigate('/check-email', { state: { email } })
  }

  return (
    <AuthCard
      title={t('registerPage.createYourAccount')}
      description={t('registerPage.saveYourProjectsQuotationsAnd')}
      footer={
        <p>
          {t('registerPage.alreadyHaveAnAccount')} <Link to="/login">{t('registerPage.signIn')}</Link>
        </p>
      }
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <FormAlert>{error?.message}</FormAlert>
        <div className="auth-form__row">
          <FormField
            label={t('registerPage.firstName')}
            autoComplete="given-name"
            value={form.firstName}
            onChange={update('firstName')}
            error={fieldErrors.firstName}
          />
          <FormField
            label={t('registerPage.lastName')}
            autoComplete="family-name"
            value={form.lastName}
            onChange={update('lastName')}
            error={fieldErrors.lastName}
          />
        </div>
        <FormField
          label={t('registerPage.email')}
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={update('email')}
          error={fieldErrors.email}
        />
        <FormField
          label={t('registerPage.phoneOptional')}
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={update('phone')}
          error={fieldErrors.phone}
        />
        <PasswordField
          label={t('registerPage.password')}
          autoComplete="new-password"
          value={form.password}
          onChange={update('password')}
          error={fieldErrors.password}
          hint={passwordHint()}
        />
        <PasswordField
          label={t('registerPage.confirmPassword')}
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={update('confirmPassword')}
          error={fieldErrors.confirmPassword}
        />
        <SubmitButton pending={pending} pendingText={t('registerPage.creatingAccount')}>
          {t('registerPage.createAccount')}
        </SubmitButton>
      </form>
    </AuthCard>
  )
}
