import { describe, expect, it } from 'vitest'
import {
  EMPTY_MEASUREMENT_FORM,
  parseDimension,
  previewAmount,
  toMeasurementForm,
  toMeasurementRequest,
  validateMeasurement,
} from './measurementForm.js'

const WALL = { code: 'wall', baseUnit: 'm2', requiredDimensions: ['lengthM', 'heightM'] }
const COLUMN = { code: 'column', baseUnit: 'm3', requiredDimensions: ['lengthM', 'widthM', 'heightM'] }

const WALL_FORM = { ...EMPTY_MEASUREMENT_FORM, elementType: 'wall', lengthM: '3,5', heightM: '2,4', quantity: '4' }

describe('parseDimension', () => {
  it('accepts a decimal comma and limits the value to 1000 m', () => {
    expect(parseDimension('3,5')).toBe(3.5)
    expect(parseDimension('0')).toBeNull()
    expect(parseDimension('1000.01')).toBeNull()
  })
})

describe('validateMeasurement', () => {
  it('accepts a wall without width', () => {
    expect(validateMeasurement(WALL_FORM, WALL, 1)).toEqual({})
  })

  it('asks for every dimension the element needs', () => {
    const errors = validateMeasurement({ ...EMPTY_MEASUREMENT_FORM, elementType: 'column', lengthM: '0,25' }, COLUMN, 1)

    expect(Object.keys(errors)).toEqual(['widthM', 'heightM'])
  })

  it('rejects a floor the project does not have', () => {
    expect(validateMeasurement({ ...WALL_FORM, floorNumber: '2' }, WALL, 1).floorNumber).toBe(
      'The project has only 1 floor',
    )
  })

  it('asks for the element and a whole quantity', () => {
    const errors = validateMeasurement({ ...WALL_FORM, quantity: '1,5' }, undefined, 2)

    expect(errors.elementType).toBe('Choose the element')
    expect(errors.quantity).toBe('Enter a whole number from 1 to 1000')
  })
})

describe('toMeasurementRequest', () => {
  it('sends numbers and leaves out the dimensions the element does not use', () => {
    expect(toMeasurementRequest({ ...WALL_FORM, widthM: '0,15', notes: '  ' }, WALL)).toEqual({
      blueprintId: null,
      elementType: 'wall',
      floorNumber: 1,
      lengthM: 3.5,
      widthM: null,
      heightM: 2.4,
      quantity: 4,
      notes: null,
    })
  })
})

describe('toMeasurementForm', () => {
  it('fills the form with the values of the backend', () => {
    const form = toMeasurementForm({
      blueprintId: null,
      elementType: 'wall',
      floorNumber: 1,
      lengthM: 3.5,
      widthM: null,
      heightM: 2.4,
      quantity: 4,
      notes: 'Fachada',
    })

    expect(form).toMatchObject({ blueprintId: '', floorNumber: '1', lengthM: '3,5', widthM: '', notes: 'Fachada' })
  })
})

describe('previewAmount', () => {
  it('calculates the same amount as the backend', () => {
    expect(previewAmount(WALL_FORM, WALL)).toBe(33.6)
    const columns = { ...EMPTY_MEASUREMENT_FORM, lengthM: '0,25', widthM: '0,25', heightM: '2,45', quantity: '6' }
    expect(previewAmount(columns, COLUMN)).toBe(0.92)
  })

  it('waits until every value is valid', () => {
    expect(previewAmount({ ...WALL_FORM, heightM: '' }, WALL)).toBeNull()
    expect(previewAmount(WALL_FORM, undefined)).toBeNull()
  })
})
