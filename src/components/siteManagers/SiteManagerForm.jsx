import { useState } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { FormField } from '../FormField.jsx'
import { SubmitButton } from '../SubmitButton.jsx'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { toSiteManagerRequest, validateSiteManager } from '../../utils/siteManagerForm.js'
import './SiteManagerForm.css'

/** Name, document and phone of a site manager. Used to add one and to edit one. */
export function SiteManagerForm({ initialForm, onSave, onCancel, submitText }) {
  const [form, setForm] = useState(initialForm)
  const { submit, pending, error, fieldErrors, setFieldErrors } = useFormSubmit(onSave)

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const errors = validateSiteManager(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    const saved = await submit(toSiteManagerRequest(form))
    if (saved) setForm(initialForm)
  }

  return (
    <form className="site-manager-form" onSubmit={handleSubmit} noValidate>
      <FormAlert>{error && !error.fields && error.message}</FormAlert>
      <div className="site-manager-form__fields">
        <FormField label="Full name" value={form.fullName} onChange={update('fullName')} error={fieldErrors.fullName} />
        <FormField
          label="Document (optional)"
          value={form.documentNumber}
          onChange={update('documentNumber')}
          error={fieldErrors.documentNumber}
        />
        <FormField
          label="Phone (optional)"
          type="tel"
          value={form.phone}
          onChange={update('phone')}
          error={fieldErrors.phone}
        />
      </div>
      <div className="button-row">
        <SubmitButton pending={pending} pendingText="Saving…">
          {submitText}
        </SubmitButton>
        {onCancel && (
          <button type="button" className="button-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
