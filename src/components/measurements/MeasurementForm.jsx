import { useState } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { FormField } from '../FormField.jsx'
import { SelectField } from '../SelectField.jsx'
import { SubmitButton } from '../SubmitButton.jsx'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { formatAmount } from '../../utils/format.js'
import { DIMENSION_LABELS, previewAmount, toMeasurementRequest, validateMeasurement } from '../../utils/measurementForm.js'
import './MeasurementForm.css'

/**
 * Form to add or edit a manual measurement. Only the dimensions of the
 * chosen element are shown, and the amount is calculated while typing.
 * `onSave(request)` sends it; it returns the saved measurement or nothing.
 */
export function MeasurementForm({ initialForm, elementTypes, blueprints, floors, onSave, onCancel, submitText }) {
  const [form, setForm] = useState(initialForm)
  const { submit, pending, error, fieldErrors, setFieldErrors } = useFormSubmit(onSave)
  const element = elementTypes.find((type) => type.code === form.elementType)
  const amount = previewAmount(form, element)

  const elementOptions = elementTypes.map((type) => ({ value: type.code, label: type.label }))
  const floorOptions = Array.from({ length: floors }, (_, index) => ({
    value: String(index + 1),
    label: `Floor ${index + 1}`,
  }))
  const blueprintOptions = blueprints.map((blueprint) => ({ value: blueprint.id, label: blueprint.originalFilename }))

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const found = validateMeasurement(form, element, floors)
    if (Object.keys(found).length > 0) {
      setFieldErrors(found)
      return
    }
    await submit(toMeasurementRequest(form, element))
  }

  return (
    <form className="measurement-form" onSubmit={handleSubmit} noValidate>
      <FormAlert>{error && !error.fields && error.message}</FormAlert>
      <div className="measurement-form__row">
        <SelectField
          label="Element"
          placeholder="Choose an element"
          options={elementOptions}
          value={form.elementType}
          onChange={update('elementType')}
          error={fieldErrors.elementType}
        />
        <SelectField
          label="Floor"
          options={floorOptions}
          value={form.floorNumber}
          onChange={update('floorNumber')}
          error={fieldErrors.floorNumber}
        />
        <SelectField
          label="Blueprint (optional)"
          placeholder="No blueprint"
          options={blueprintOptions}
          value={form.blueprintId}
          onChange={update('blueprintId')}
          error={fieldErrors.blueprintId}
        />
      </div>
      {element && (
        <div className="measurement-form__row">
          {element.requiredDimensions.map((field) => (
            <FormField
              key={field}
              label={DIMENSION_LABELS[field]}
              inputMode="decimal"
              placeholder="0,00"
              value={form[field]}
              onChange={update(field)}
              error={fieldErrors[field]}
            />
          ))}
          <FormField
            label="Quantity"
            inputMode="numeric"
            value={form.quantity}
            onChange={update('quantity')}
            error={fieldErrors.quantity}
            hint="How many equal elements"
          />
        </div>
      )}
      <FormField label="Notes (optional)" value={form.notes} onChange={update('notes')} error={fieldErrors.notes} />
      <p className="measurement-form__amount" aria-live="polite">
        {amount === null ? 'Fill in the dimensions to see the amount.' : `Amount: ${formatAmount(amount, element.baseUnit)}`}
      </p>
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
