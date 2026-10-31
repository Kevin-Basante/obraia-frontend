import { useState } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { FormField } from '../FormField.jsx'
import { SelectField } from '../SelectField.jsx'
import { SubmitButton } from '../SubmitButton.jsx'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { workFieldErrors } from '../../utils/workForm.js'
import './WorkItemForm.css'

/**
 * Name and planned dates of a phase or a task. With `phases` it also asks
 * for the phase of the task. `validate(form)` checks the rules before
 * `onSave(form)` sends it.
 */
export function WorkItemForm({ initialForm, phases, validate, onSave, onCancel, submitText }) {
  const [form, setForm] = useState(initialForm)
  const { submit, pending, error, fieldErrors, setFieldErrors } = useFormSubmit(onSave)
  const errors = workFieldErrors(fieldErrors)

  function update(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }))
      setFieldErrors((current) => {
        if (!current[field] && !(field.startsWith('planned') && current.plannedDatesInOrder)) return current
        const rest = { ...current }
        delete rest[field]
        delete rest.plannedDatesInOrder
        return rest
      })
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const found = validate(form)
    if (Object.keys(found).length > 0) {
      setFieldErrors(found)
      return
    }
    await submit(form)
  }

  return (
    <form className="work-item-form" onSubmit={handleSubmit} noValidate>
      <FormAlert>{error && !error.fields && error.message}</FormAlert>
      <div className="work-item-form__row">
        {phases && (
          <SelectField
            label="Phase"
            placeholder="Choose a phase"
            options={phases.map((phase) => ({ value: phase.id, label: `${phase.order}. ${phase.name}` }))}
            value={form.phaseId}
            onChange={update('phaseId')}
            error={errors.phaseId}
          />
        )}
        <FormField label="Name" value={form.name} onChange={update('name')} error={errors.name} />
      </div>
      <div className="work-item-form__row">
        <FormField
          label="Planned start (optional)"
          type="date"
          value={form.plannedStartDate}
          onChange={update('plannedStartDate')}
          error={errors.plannedStartDate}
        />
        <FormField
          label="Planned end (optional)"
          type="date"
          value={form.plannedEndDate}
          onChange={update('plannedEndDate')}
          error={errors.plannedEndDate}
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
