import { useState } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { PasswordField } from '../PasswordField.jsx'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { requestAccountDeletion } from '../../services/accountService.js'
import { serverMessage } from '../../utils/serverMessage.js'
import { t } from '../../i18n/i18n.js'

/** Asks for the password again and sends the confirmation email. */
export function DeleteAccountForm() {
  const [password, setPassword] = useState('')
  const [understood, setUnderstood] = useState(false)
  const [sent, setSent] = useState(null)
  const { submit, pending, error, fieldErrors, setFieldErrors } = useFormSubmit(requestAccountDeletion)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!password) {
      setFieldErrors({ password: t('deleteAccountForm.enterYourPassword') })
      return
    }
    const response = await submit(password)
    if (response) setSent(serverMessage(response))
  }

  return (
    <form className="card account-form" onSubmit={handleSubmit} noValidate>
      {sent ? (
        <FormAlert type="success">{t('serverMessages.withLink', { message: sent })}</FormAlert>
      ) : (
        <>
          <FormAlert>{error && !error.fields && error.message}</FormAlert>
          <div className="account-form__email">
            <PasswordField
              label={t('deleteAccountForm.yourPassword')}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
            />
          </div>
          <label className="checkbox-field">
            <input type="checkbox" checked={understood} onChange={(e) => setUnderstood(e.target.checked)} />
            {t('deleteAccountForm.understand')}
          </label>
          <div className="button-row">
            <button type="submit" className="button-danger" disabled={!understood || pending}>
              {pending ? t('deleteAccountForm.sending') : t('deleteAccountForm.emailMeTheConfirmationLink')}
            </button>
          </div>
        </>
      )}
    </form>
  )
}
