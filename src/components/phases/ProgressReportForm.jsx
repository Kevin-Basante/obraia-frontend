import { useState } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { FormField } from '../FormField.jsx'
import { SubmitButton } from '../SubmitButton.jsx'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { EMPTY_PROGRESS_FORM, toProgressRequest, todayIso, validateProgress } from '../../utils/progressForm.js'
import './WorkItemForm.css'

/**
 * Form to report how far a task went. The checkbox of the site manager
 * only appears when the project has one assigned.
 */
export function ProgressReportForm({ siteManager, onSave }) {
  const [form, setForm] = useState(EMPTY_PROGRESS_FORM)
  const { submit, pending, error, fieldErrors, setFieldErrors } = useFormSubmit(onSave)
  const today = todayIso()

  function update(field) {
    return (event) => {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
      setForm((current) => ({ ...current, [field]: value }))
      setFieldErrors((current) => {
        if (!current[field]) return current
        const rest = { ...current }
        delete rest[field]
        return rest
      })
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const found = validateProgress(form, today)
    if (Object.keys(found).length > 0) {
      setFieldErrors(found)
      return
    }
    const saved = await submit(toProgressRequest(form))
    if (saved) setForm(EMPTY_PROGRESS_FORM)
  }

  return (
    <form className="work-item-form" onSubmit={handleSubmit} noValidate>
      <FormAlert>{error && !error.fields && error.message}</FormAlert>
      <div className="work-item-form__row">
        <FormField
          label="Progress (%)"
          inputMode="decimal"
          placeholder="40"
          value={form.completionPercentage}
          onChange={update('completionPercentage')}
          error={fieldErrors.completionPercentage}
          hint="Total progress of the task, from 0 to 100"
        />
        <FormField
          label="Date (optional)"
          type="date"
          max={today}
          value={form.reportDate}
          onChange={update('reportDate')}
          error={fieldErrors.reportDate}
          hint="Today if it is empty"
        />
      </div>
      <FormField label="Notes (optional)" value={form.notes} onChange={update('notes')} error={fieldErrors.notes} />
      {siteManager && (
        <label className="checkbox-field">
          <input type="checkbox" checked={form.fromSiteManager} onChange={update('fromSiteManager')} />
          <span>Reported by the site manager, {siteManager.fullName}</span>
        </label>
      )}
      <FormAlert>{fieldErrors.fromSiteManager}</FormAlert>
      <div className="button-row">
        <SubmitButton pending={pending} pendingText="Saving…">
          Save report
        </SubmitButton>
      </div>
    </form>
  )
}
