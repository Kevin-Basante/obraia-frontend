import { useState } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { FormField } from '../FormField.jsx'
import { SelectField } from '../SelectField.jsx'
import { SubmitButton } from '../SubmitButton.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { getLocations, getProjectTypes } from '../../services/catalogService.js'
import { toFormErrors, toProjectRequest, validateProject } from '../../utils/projectForm.js'
import './ProjectForm.css'

const FLOOR_OPTIONS = [
  { value: '1', label: '1 floor' },
  { value: '2', label: '2 floors' },
]

/**
 * Form to create or edit a project. `onSave(request)` sends it to the
 * backend; the project types and cities come from the catalog.
 */
export function ProjectForm({ initialForm, onSave, submitText, pendingText }) {
  const [form, setForm] = useState(initialForm)
  const { submit, pending, error, fieldErrors, setFieldErrors } = useFormSubmit(onSave)
  const types = useApiData((signal) => getProjectTypes({ signal }), [])
  const cities = useApiData((signal) => getLocations({}, { signal }), [])

  const typeOptions = (types.data ?? []).map((type) => ({ value: type.id, label: type.name }))
  const cityOptions = (cities.data ?? []).map((city) => ({ value: city.id, label: `${city.city}, ${city.department}` }))
  const errors = toFormErrors(fieldErrors)

  function update(field) {
    return (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const found = validateProject(form)
    if (Object.keys(found).length > 0) {
      setFieldErrors(found)
      return
    }
    await submit(toProjectRequest(form))
  }

  const catalogError = types.error ?? cities.error

  return (
    <form className="card project-form" onSubmit={handleSubmit} noValidate>
      <FormAlert>{catalogError && `We could not load the catalog: ${catalogError.message}`}</FormAlert>
      <FormAlert>{error && !error.fields && error.message}</FormAlert>
      <FormField label="Project name" value={form.name} onChange={update('name')} error={errors.name} />
      <div className="project-form__row">
        <SelectField
          label="Project type"
          placeholder={types.status === 'loading' ? 'Loading…' : 'Choose a type'}
          options={typeOptions}
          value={form.projectTypeId}
          onChange={update('projectTypeId')}
          error={errors.projectTypeId}
        />
        <SelectField
          label="City"
          placeholder={cities.status === 'loading' ? 'Loading…' : 'Choose a city'}
          options={cityOptions}
          value={form.locationId}
          onChange={update('locationId')}
          error={errors.locationId}
        />
      </div>
      <FormField label="Address (optional)" value={form.address} onChange={update('address')} error={errors.address} />
      <div className="project-form__row">
        <FormField
          label="Built area (m²)"
          inputMode="decimal"
          placeholder="120,5"
          value={form.builtAreaM2}
          onChange={update('builtAreaM2')}
          error={errors.builtAreaM2}
          hint="Up to 120 m² is a small project; more is a large one."
        />
        <SelectField
          label="Floors"
          options={FLOOR_OPTIONS}
          value={form.floors}
          onChange={update('floors')}
          error={errors.floors}
        />
      </div>
      <div className="project-form__row">
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
      <SubmitButton pending={pending} pendingText={pendingText}>
        {submitText}
      </SubmitButton>
    </form>
  )
}
