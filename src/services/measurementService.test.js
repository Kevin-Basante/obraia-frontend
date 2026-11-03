import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createMeasurement,
  deleteMeasurement,
  getMeasurementComparison,
  listMeasurements,
  updateMeasurement,
} from './measurementService.js'

let fetchMock

beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue(
    new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }),
  )
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function sentRequest(index = 0) {
  const [url, init] = fetchMock.mock.calls[index]
  const { pathname, search } = new URL(url)
  return { path: pathname + search, method: init.method, body: init.body ? JSON.parse(init.body) : undefined }
}

describe('measurement services', () => {
  it('lists the measurements with the filters', async () => {
    await listMeasurements('p1', { floor: 2, element: 'wall' })

    expect(sentRequest()).toEqual({
      path: '/api/projects/p1/measurements?floor=2&element=wall',
      method: 'GET',
      body: undefined,
    })
  })

  it('lists every measurement without filters', async () => {
    await listMeasurements('p1')

    expect(sentRequest().path).toBe('/api/projects/p1/measurements')
  })

  it('creates, updates and deletes a measurement', async () => {
    const measurement = { elementType: 'wall', lengthM: 3 }
    await createMeasurement('p1', measurement)
    await updateMeasurement('p1', 'm1', measurement)
    await deleteMeasurement('p1', 'm1')

    expect(sentRequest(0)).toEqual({ path: '/api/projects/p1/measurements', method: 'POST', body: measurement })
    expect(sentRequest(1)).toEqual({ path: '/api/projects/p1/measurements/m1', method: 'PUT', body: measurement })
    expect(sentRequest(2)).toEqual({ path: '/api/projects/p1/measurements/m1', method: 'DELETE', body: undefined })
  })

  it('reads the comparison', async () => {
    await getMeasurementComparison('p1')

    expect(sentRequest().path).toBe('/api/projects/p1/measurements/comparison')
  })
})
