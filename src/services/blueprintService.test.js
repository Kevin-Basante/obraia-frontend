import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { deleteBlueprint, getBlueprintFile, uploadBlueprint } from './blueprintService.js'
import { getMeasurementComparison, listMeasurements, updateMeasurement } from './measurementService.js'

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

/** Path, method and options of the request that the service sent. */
function sentRequest() {
  const [url, init] = fetchMock.mock.calls[0]
  const { pathname, search } = new URL(url)
  return { path: pathname + search, method: init.method, init }
}

describe('blueprint services', () => {
  it('uploads the file in the part "file"', async () => {
    const file = new File(['%PDF-'], 'plano.pdf', { type: 'application/pdf' })

    await uploadBlueprint('p1', file)

    const { path, method, init } = sentRequest()
    expect(path).toBe('/api/projects/p1/blueprints')
    expect(method).toBe('POST')
    expect(init.body.get('file').name).toBe('plano.pdf')
  })

  it('reads the file of a blueprint as a blob', async () => {
    fetchMock.mockResolvedValue(new Response('png', { status: 200, headers: { 'Content-Type': 'image/png' } }))

    const blob = await getBlueprintFile('p1', 'b1')

    expect(sentRequest().path).toBe('/api/projects/p1/blueprints/b1/file')
    expect(blob.type).toBe('image/png')
  })

  it('deletes a blueprint with DELETE', async () => {
    await deleteBlueprint('p1', 'b1')

    expect(sentRequest()).toMatchObject({ path: '/api/projects/p1/blueprints/b1', method: 'DELETE' })
  })
})

describe('measurement services', () => {
  it('sends only the filters that have a value', async () => {
    await listMeasurements('p1', { floor: 2, element: '' })

    expect(sentRequest().path).toBe('/api/projects/p1/measurements?floor=2')
  })

  it('edits a measurement with PUT', async () => {
    await updateMeasurement('p1', 'm1', { elementType: 'wall' })

    const { path, method, init } = sentRequest()
    expect({ path, method }).toEqual({ path: '/api/projects/p1/measurements/m1', method: 'PUT' })
    expect(JSON.parse(init.body)).toEqual({ elementType: 'wall' })
  })

  it('reads the comparison of the project', async () => {
    await getMeasurementComparison('p1')

    expect(sentRequest().path).toBe('/api/projects/p1/measurements/comparison')
  })
})
