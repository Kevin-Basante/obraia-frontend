import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { confirmAccountDeletion, getAccountDeletionImpact, requestAccountDeletion } from './accountService.js'

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

/** Path, method, body and auth header of the request that the service sent. */
function sentRequest() {
  const [url, init] = fetchMock.mock.calls[0]
  return {
    path: new URL(url).pathname,
    method: init.method,
    body: init.body ? JSON.parse(init.body) : undefined,
    auth: init.headers.Authorization,
  }
}

describe('account deletion services', () => {
  it('reads what the deletion would remove', async () => {
    await getAccountDeletionImpact()

    expect(sentRequest().path).toBe('/api/users/me/deletion-impact')
  })

  it('asks for the deletion with the password', async () => {
    await requestAccountDeletion('secret123')

    const request = sentRequest()
    expect(request.path).toBe('/api/users/me/deletion-request')
    expect(request.method).toBe('POST')
    expect(request.body).toEqual({ password: 'secret123' })
  })

  it('confirms with the token and no session', async () => {
    await confirmAccountDeletion('abc')

    const request = sentRequest()
    expect(request.path).toBe('/api/users/deletion/confirm')
    expect(request.body).toEqual({ token: 'abc' })
    expect(request.auth).toBeUndefined()
  })
})
