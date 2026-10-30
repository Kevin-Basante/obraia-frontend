import { parseArea } from './projectForm.js'

// Same rules as the backend for a measurement, checked before sending the form.
// Which dimensions are needed comes from the element type catalog.

export const EMPTY_MEASUREMENT_FORM = {
  blueprintId: '',
  elementType: '',
  floorNumber: '1',
  lengthM: '',
  widthM: '',
  heightM: '',
  quantity: '1',
  notes: '',
}

export const DIMENSION_LABELS = {
  lengthM: 'Length (m)',
  widthM: 'Width (m)',
  heightM: 'Height (m)',
}

/** A dimension in meters: "3,5" is read as 3.5. Returns null if it is not valid. */
export function parseDimension(text) {
  const value = parseArea(text ?? '')
  return value !== null && value >= 0.01 && value <= 1000 ? value : null
}

function parseQuantity(text) {
  const value = Number(text.trim())
  return Number.isInteger(value) && value >= 1 && value <= 1000 ? value : null
}

/** Returns one message per invalid field (empty if the form is valid). */
export function validateMeasurement(form, element, floors) {
  const errors = {}
  if (!element) errors.elementType = 'Choose the element'
  const floor = Number(form.floorNumber)
  if (floor !== 1 && floor !== 2) errors.floorNumber = 'Choose the floor'
  else if (floor > floors) errors.floorNumber = `The project has only ${floors} floor`
  for (const field of element?.requiredDimensions ?? ['lengthM']) {
    if (parseDimension(form[field]) === null) errors[field] = 'Enter a value from 0,01 to 1000 m, with up to 2 decimals'
  }
  if (parseQuantity(form.quantity) === null) errors.quantity = 'Enter a whole number from 1 to 1000'
  if (form.notes.trim().length > 500) errors.notes = 'Use at most 500 characters'
  return errors
}

/** Body that the backend expects. Dimensions the element does not use are sent as null. */
export function toMeasurementRequest(form, element) {
  const dimension = (field) => (element.requiredDimensions.includes(field) ? parseDimension(form[field]) : null)
  return {
    blueprintId: form.blueprintId || null,
    elementType: form.elementType,
    floorNumber: Number(form.floorNumber),
    lengthM: parseDimension(form.lengthM),
    widthM: dimension('widthM'),
    heightM: dimension('heightM'),
    quantity: parseQuantity(form.quantity),
    notes: form.notes.trim() || null,
  }
}

/** Fills the form to edit a measurement from the backend. */
export function toMeasurementForm(measurement) {
  // Decimals are shown with a comma, as the user types them.
  const text = (value) => (value === null || value === undefined ? '' : String(value).replace('.', ','))
  return {
    blueprintId: measurement.blueprintId ?? '',
    elementType: measurement.elementType,
    floorNumber: String(measurement.floorNumber),
    lengthM: text(measurement.lengthM),
    widthM: text(measurement.widthM),
    heightM: text(measurement.heightM),
    quantity: String(measurement.quantity),
    notes: measurement.notes ?? '',
  }
}

/**
 * Amount the backend will calculate, shown while the user types: the
 * product of the required dimensions times the quantity, rounded to 2
 * decimals. Null while a value is missing.
 */
export function previewAmount(form, element) {
  if (!element) return null
  const quantity = parseQuantity(form.quantity)
  if (quantity === null) return null
  let amount = quantity
  for (const field of element.requiredDimensions) {
    const value = parseDimension(form[field])
    if (value === null) return null
    amount *= value
  }
  return Math.round(amount * 100) / 100
}
