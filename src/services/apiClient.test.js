import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, apiGet, apiPost, apiRequest } from './apiClient.js'

/** Fake fetch answer with the given status and JSON body. */
function jsonResponse(status, body) {
  return new Response(body === undefined ? null : JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('apiRequest', () => {
  it('returns the JSON body of a successful answer', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, { message: 'Hello world' }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(apiGet('/api/hello')).resolves.toEqual({ message: 'Hello world' })
    expect(fetchMock.mock.calls[0][0]).toMatch(/\/api\/hello$/)
  })

  it('sends the body as JSON and the token in the Authorization header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(200, {}))
    vi.stubGlobal('fetch', fetchMock)

    await apiPost('/api/auth/login', { email: 'ana@example.com' }, { token: 'abc' })

    const [, options] = fetchMock.mock.calls[0]
    expect(options.method).toBe('POST')
    expect(options.body).toBe('{"email":"ana@example.com"}')
    expect(options.headers['Content-Type']).toBe('application/json')
    expect(options.headers.Authorization).toBe('Bearer abc')
  })

  it('returns null when the answer has no body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(null, { status: 204 })))

    await expect(apiPost('/api/auth/logout', {})).resolves.toBeNull()
  })

  it('turns a backend error into an ApiError with its code and fields', async () => {
    const body = { error: { code: 'VALIDATION_ERROR', message: 'Check the form', fields: { email: 'Invalid' } } }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(400, body)))

    const error = await apiPost('/api/auth/register', {}).catch((err) => err)

    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 400, code: 'VALIDATION_ERROR', message: 'Check the form' })
    expect(error.fields).toEqual({ email: 'Invalid' })
  })

  it('reports a network failure with its own code', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('Failed to fetch')))

    await expect(apiGet('/api/hello')).rejects.toMatchObject({ code: 'NETWORK_ERROR' })
  })

  it('sends a FormData body as it is, without the JSON header', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(201, { id: 'b1' }))
    vi.stubGlobal('fetch', fetchMock)
    const form = new FormData()
    form.append('file', new Blob(['%PDF-']), 'plano.pdf')

    await apiPost('/api/projects/p1/blueprints', form)

    const [, options] = fetchMock.mock.calls[0]
    expect(options.body).toBe(form)
    expect(options.headers['Content-Type']).toBeUndefined()
  })

  it('returns the bytes of a file when asked for a blob', async () => {
    const file = new Response('%PDF-', { status: 200, headers: { 'Content-Type': 'application/pdf' } })
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(file))

    const blob = await apiRequest('/api/projects/p1/blueprints/b1/file', { responseType: 'blob' })

    expect(blob.type).toBe('application/pdf')
    expect(await blob.text()).toBe('%PDF-')
  })
})
