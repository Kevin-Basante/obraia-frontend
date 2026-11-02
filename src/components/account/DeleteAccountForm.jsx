import { useState } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { PasswordField } from '../PasswordField.jsx'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { requestAccountDeletion } from '../../services/accountService.js'

/** Asks for the password again and sends the confirmation email. */
export function DeleteAccountForm() {
  const [password, setPassword] = useState('')
  const [understood, setUnderstood] = useState(false)
  const [sent, setSent] = useState(null)
  const { submit, pending, error, fieldErrors, setFieldErrors } = useFormSubmit(requestAccountDeletion)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!password) {
      setFieldErrors({ password: 'Enter your password' })
      return
    }
    const response = await submit(password)
    if (response) setSent(response.message)
  }

  return (
    <form className="card account-form" onSubmit={handleSubmit} noValidate>
      {sent ? (
        <FormAlert type="success">{sent}. Open the link in that email to finish.</FormAlert>
      ) : (
        <>
          <FormAlert>{error && !error.fields && error.message}</FormAlert>
          <div className="account-form__email">
            <PasswordField
              label="Your password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
            />
          </div>
          <label className="checkbox-field">
            <input type="checkbox" checked={understood} onChange={(e) => setUnderstood(e.target.checked)} />I
            understand that my account and the projects I created will be deleted.
          </label>
          <div className="button-row">
            <button type="submit" className="button-danger" disabled={!understood || pending}>
              {pending ? 'Sending…' : 'Email me the confirmation link'}
            </button>
          </div>
        </>
      )}
    </form>
  )
}
