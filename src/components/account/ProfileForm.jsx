import { useState } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { FormField } from '../FormField.jsx'
import { SubmitButton } from '../SubmitButton.jsx'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { toProfileForm, toProfileRequest, validateProfile } from '../../utils/profileForm.js'
import './AccountForms.css'

/** Name and phone of the signed-in user. The email cannot be changed. */
export function ProfileForm({ user, onSave }) {
  const [form, setForm] = useState(() => toProfileForm(user))
  const [saved, setSaved] = useState(false)
  const { submit, pending, error, fieldErrors, setFieldErrors } = useFormSubmit(onSave)

  function update(field) {
    return (event) => {
      setSaved(false)
      setForm((current) => ({ ...current, [field]: event.target.value }))
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const errors = validateProfile(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    const updated = await submit(toProfileRequest(form))
    if (updated) {
      setForm(toProfileForm(updated))
      setSaved(true)
    }
  }

  return (
    <form className="account-form" onSubmit={handleSubmit} noValidate>
      <FormAlert>{error && !error.fields && error.message}</FormAlert>
      <FormAlert type="success">{saved && 'Your profile was saved.'}</FormAlert>
      <div className="account-form__fields">
        <FormField
          label="First name"
          autoComplete="given-name"
          value={form.firstName}
          onChange={update('firstName')}
          error={fieldErrors.firstName}
        />
        <FormField
          label="Last name"
          autoComplete="family-name"
          value={form.lastName}
          onChange={update('lastName')}
          error={fieldErrors.lastName}
        />
        <FormField
          label="Phone (optional)"
          type="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={update('phone')}
          error={fieldErrors.phone}
        />
      </div>
      <div className="account-form__email">
        <FormField label="Email" value={user.email} readOnly hint="The email cannot be changed." />
      </div>
      <div className="button-row">
        <SubmitButton pending={pending} pendingText="Saving…">
          Save profile
        </SubmitButton>
      </div>
    </form>
  )
}
