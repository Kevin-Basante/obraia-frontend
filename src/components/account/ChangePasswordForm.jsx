import { useState } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { PasswordField } from '../PasswordField.jsx'
import { SubmitButton } from '../SubmitButton.jsx'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { changePassword } from '../../services/userService.js'
import { PASSWORD_HINT, validatePasswordChange } from '../../utils/validation.js'
import './AccountForms.css'

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
    if (response) onChanged(response.message)
  }

  return (
    <form className="account-form account-form__email" onSubmit={handleSubmit} noValidate>
      <FormAlert>{error && !error.fields && error.message}</FormAlert>
      <PasswordField
        label="Current password"
        autoComplete="current-password"
        value={form.currentPassword}
        onChange={update('currentPassword')}
        error={fieldErrors.currentPassword}
      />
      <PasswordField
        label="New password"
        autoComplete="new-password"
        value={form.newPassword}
        onChange={update('newPassword')}
        error={fieldErrors.newPassword}
        hint={PASSWORD_HINT}
      />
      <PasswordField
        label="Confirm new password"
        autoComplete="new-password"
        value={form.confirmPassword}
        onChange={update('confirmPassword')}
        error={fieldErrors.confirmPassword}
      />
      <p className="muted">After the change you sign in again, here and on your other devices.</p>
      <div className="button-row">
        <SubmitButton pending={pending} pendingText="Saving…">
          Change password
        </SubmitButton>
      </div>
    </form>
  )
}
