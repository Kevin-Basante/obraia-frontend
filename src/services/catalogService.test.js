import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  getDepartments,
  getElementTypes,
  getLocations,
  getMaterialCategories,
  getMaterialFormulas,
  getMaterials,
  getPhasePlan,
  getProjectType,
  getProjectTypes,
} from './catalogService.js'

let fetchMock

beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue(
    new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } }),
  )
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

/** Path and query of the URL that the service requested. */
function requestedPath() {
  const url = new URL(fetchMock.mock.calls[0][0])
  return url.pathname + url.search
}

describe('catalogService', () => {
  it('reads the catalogs without a session token', async () => {
    await getProjectTypes()

    expect(requestedPath()).toBe('/api/catalogs/project-types')
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined()
  })

  it('sends only the material filters that have a value', async () => {
    await getMaterials({ category: 'aggregates', search: '' })

    expect(requestedPath()).toBe('/api/catalogs/materials?category=aggregates')
  })

  it('sends the area or the size for the phase plan', async () => {
    await getPhasePlan('abc', { size: 'small', area: 150 })

    expect(requestedPath()).toBe('/api/catalogs/project-types/abc/phases?size=small&area=150')
  })

  it('encodes the department name', async () => {
    await getLocations({ department: 'Bolívar' })

    expect(requestedPath()).toBe('/api/catalogs/locations?department=Bol%C3%ADvar')
  })
})

describe('catalogService paths', () => {
  function pathOf(index) {
    const url = new URL(fetchMock.mock.calls[index][0])
    return url.pathname + url.search
  }

  it('reads one project type and its material formulas', async () => {
    await getProjectType('house')
    await getMaterialFormulas('house', { element: 'wall' })

    expect(pathOf(0)).toBe('/api/catalogs/project-types/house')
    expect(pathOf(1)).toBe('/api/catalogs/project-types/house/material-formulas?element=wall')
  })

  it('reads departments, material categories and element types', async () => {
    await getDepartments()
    await getMaterialCategories()
    await getElementTypes()

    expect([pathOf(0), pathOf(1), pathOf(2)]).toEqual([
      '/api/catalogs/locations/departments',
      '/api/catalogs/material-categories',
      '/api/catalogs/element-types',
    ])
  })
})
