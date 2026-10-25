// Same rules as the backend for a project, checked before sending the form.

const AREA_PATTERN = /^\d{1,4}(\.\d{1,2})?$/

export const EMPTY_PROJECT_FORM = {
  name: '',
  projectTypeId: '',
  locationId: '',
  address: '',
  builtAreaM2: '',
  floors: '1',
  plannedStartDate: '',
  plannedEndDate: '',
}

/** Users in Colombia write decimals with a comma: "120,5" is read as 120.5. */
export function parseArea(text) {
  const normalized = text.trim().replace(',', '.')
  return AREA_PATTERN.test(normalized) ? Number(normalized) : null
}

/** Returns one message per invalid field (empty if the form is valid). */
export function validateProject(form) {
  const errors = {}
  const name = form.name.trim()
  if (name.length < 3 || name.length > 150) errors.name = 'Use 3 to 150 characters'
  if (!form.projectTypeId) errors.projectTypeId = 'Choose the project type'
  if (!form.locationId) errors.locationId = 'Choose the city'
  if (form.address.trim().length > 255) errors.address = 'Use at most 255 characters'
  const area = parseArea(form.builtAreaM2)
  if (area === null || area < 1 || area > 2000) {
    errors.builtAreaM2 = 'Enter an area from 1 to 2000 m², with up to 2 decimals'
  }
  if (form.floors !== '1' && form.floors !== '2') errors.floors = 'Choose 1 or 2 floors'
  if (form.plannedStartDate && form.plannedEndDate && form.plannedEndDate < form.plannedStartDate) {
    errors.plannedEndDate = 'The end date cannot be before the start date'
  }
  return errors
}

/** Body that the backend expects. Empty optional fields are sent as null. */
export function toProjectRequest(form) {
  return {
    name: form.name.trim(),
    projectTypeId: form.projectTypeId,
    locationId: form.locationId,
    address: form.address.trim() || null,
    builtAreaM2: parseArea(form.builtAreaM2),
    floors: Number(form.floors),
    plannedStartDate: form.plannedStartDate || null,
    plannedEndDate: form.plannedEndDate || null,
  }
}

/** Fills the edit form with a project from the backend. */
export function toProjectForm(project) {
  return {
    name: project.name,
    projectTypeId: project.projectType.id,
    locationId: project.location.id,
    address: project.address ?? '',
    builtAreaM2: String(project.builtAreaM2),
    floors: String(project.floors),
    plannedStartDate: project.plannedStartDate ?? '',
    plannedEndDate: project.plannedEndDate ?? '',
  }
}

/**
 * The backend reports the date order under "plannedDatesInOrder"; the form
 * shows it under the end date, next to the field the user has to change.
 */
export function toFormErrors(fields) {
  if (!fields) return {}
  const { plannedDatesInOrder, ...rest } = fields
  return plannedDatesInOrder ? { ...rest, plannedEndDate: plannedDatesInOrder } : rest
}
