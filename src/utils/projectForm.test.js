import { describe, expect, it } from 'vitest'
import { EMPTY_PROJECT_FORM, parseArea, toFormErrors, toProjectForm, toProjectRequest, validateProject } from './projectForm.js'

const VALID = {
  ...EMPTY_PROJECT_FORM,
  name: 'Casa Prueba',
  projectTypeId: 'type-1',
  locationId: 'city-1',
  builtAreaM2: '120,5',
  floors: '2',
}

describe('parseArea', () => {
  it('accepts a comma or a dot as decimal separator', () => {
    expect(parseArea('120,5')).toBe(120.5)
    expect(parseArea(' 95.25 ')).toBe(95.25)
  })

  it('rejects text and more than two decimals', () => {
    expect(parseArea('abc')).toBeNull()
    expect(parseArea('10.555')).toBeNull()
    expect(parseArea('')).toBeNull()
  })
})

describe('validateProject', () => {
  it('accepts a complete form', () => {
    expect(validateProject(VALID)).toEqual({})
  })

  it('reports each missing field', () => {
    expect(Object.keys(validateProject(EMPTY_PROJECT_FORM)).sort()).toEqual([
      'builtAreaM2',
      'locationId',
      'name',
      'projectTypeId',
    ])
  })

  it('limits the area to 2000 m2', () => {
    expect(validateProject({ ...VALID, builtAreaM2: '2000' }).builtAreaM2).toBeUndefined()
    expect(validateProject({ ...VALID, builtAreaM2: '2000,01' }).builtAreaM2).toBeDefined()
  })

  it('rejects an end date before the start date', () => {
    const errors = validateProject({ ...VALID, plannedStartDate: '2026-11-02', plannedEndDate: '2026-11-01' })

    expect(errors.plannedEndDate).toBeDefined()
  })
})

describe('toProjectRequest', () => {
  it('converts numbers and sends empty optional fields as null', () => {
    expect(toProjectRequest({ ...VALID, name: ' Casa Prueba ', address: ' ' })).toEqual({
      name: 'Casa Prueba',
      projectTypeId: 'type-1',
      locationId: 'city-1',
      address: null,
      builtAreaM2: 120.5,
      floors: 2,
      plannedStartDate: null,
      plannedEndDate: null,
    })
  })
})

describe('toProjectForm', () => {
  it('fills the form with the values of a project', () => {
    const form = toProjectForm({
      name: 'Casa Prueba',
      projectType: { id: 'type-1' },
      location: { id: 'city-1' },
      address: null,
      builtAreaM2: 120.5,
      floors: 1,
      plannedStartDate: '2026-11-02',
      plannedEndDate: null,
    })

    expect(form).toMatchObject({ builtAreaM2: '120.5', floors: '1', address: '', plannedEndDate: '' })
  })
})

describe('toFormErrors', () => {
  it('shows the date order error under the end date', () => {
    expect(toFormErrors({ plannedDatesInOrder: 'Wrong order', name: 'Too short' })).toEqual({
      plannedEndDate: 'Wrong order',
      name: 'Too short',
    })
  })

  it('returns no errors when the backend sent none', () => {
    expect(toFormErrors(null)).toEqual({})
  })
})
