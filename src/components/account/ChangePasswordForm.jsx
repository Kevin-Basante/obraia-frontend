import { useState } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { PasswordField } from '../PasswordField.jsx'
import { SubmitButton } from '../SubmitButton.jsx'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { changePassword } from '../../services/userService.js'
import { passwordHint, validatePasswordChange } from '../../utils/validation.js'
import './AccountForms.css'
import { serverMessage } from '../../utils/serverMessage.js'
import { t } from '../../i18n/i18n.js'

const EMPTY_FORM = { currentPassword: '', newPassword: '', confirmPassword: '' }

/** Changes the password. `onChanged` gets the backend message, because every session was closed. */
export function ChangePasswordForm({ onChanged }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const { submit, pending, error, fieldErrors, setFieldErrors } = useFormSubmit(changePassword)

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const errors = validatePasswordChange(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    const response = await submit(form)
    if (response) onChanged(serverMessage(response))
  }

  return (
    <form className="account-form account-form__email" onSubmit={handleSubmit} noValidate>
      <FormAlert>{error && !error.fields && error.message}</FormAlert>
      <PasswordField
        label={t('changePasswordForm.currentPassword')}
        autoComplete="current-password"
        value={form.currentPassword}
        onChange={update('currentPassword')}
        error={fieldErrors.currentPassword}
      />
      <PasswordField
        label={t('changePasswordForm.newPassword')}
        autoComplete="new-password"
        value={form.newPassword}
        onChange={update('newPassword')}
        error={fieldErrors.newPassword}
        hint={passwordHint()}
      />
      <PasswordField
        label={t('changePasswordForm.confirmNewPassword')}
        autoComplete="new-password"
        value={form.confirmPassword}
        onChange={update('confirmPassword')}
        error={fieldErrors.confirmPassword}
      />
      <p className="muted">{t('changePasswordForm.afterTheChangeYouSign')}</p>
      <div className="button-row">
        <SubmitButton pending={pending} pendingText={t('changePasswordForm.saving')}>
          {t('changePasswordForm.changePassword')}
        </SubmitButton>
      </div>
    </form>
  )
}
