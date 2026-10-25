import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { authorizedRequest, refreshSession } from './session.js'
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './tokenStorage.js'

const USER = { id: 1, firstName: 'Ana' }

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}

/** Minimal localStorage, since the tests run outside a browser. */
function memoryStorage() {
  const items = new Map()
  return {
    getItem: (key) => (items.has(key) ? items.get(key) : null),
    setItem: (key, value) => items.set(key, String(value)),
    removeItem: (key) => items.delete(key),
  }
}

beforeEach(() => {
  vi.stubGlobal('localStorage', memoryStorage())
})

afterEach(() => {
  clearTokens()
  vi.unstubAllGlobals()
})

describe('refreshSession', () => {
  it('returns null when there is no saved session', async () => {
    vi.stubGlobal('fetch', vi.fn())

    await expect(refreshSession()).resolves.toBeNull()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('saves the new tokens and returns the user', async () => {
    saveTokens({ accessToken: 'old-access', refreshToken: 'old-refresh' })
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonResponse(200, { accessToken: 'new-access', refreshToken: 'new-refresh', user: USER })),
    )

    await expect(refreshSession()).resolves.toEqual(USER)
    expect(getAccessToken()).toBe('new-access')
    expect(getRefreshToken()).toBe('new-refresh')
  })

  it('uses a single request when several callers refresh at once', async () => {
    saveTokens({ accessToken: 'a', refreshToken: 'r' })
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(200, { accessToken: 'a2', refreshToken: 'r2', user: USER }))
    vi.stubGlobal('fetch', fetchMock)

    await Promise.all([refreshSession(), refreshSession()])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('forgets the session when the backend rejects the refresh token', async () => {
    saveTokens({ accessToken: 'a', refreshToken: 'stolen' })
    const body = { error: { code: 'INVALID_REFRESH_TOKEN', message: 'Session expired' } }
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse(401, body)))

    await expect(refreshSession()).rejects.toMatchObject({ code: 'INVALID_REFRESH_TOKEN' })
    expect(getRefreshToken()).toBeNull()
  })
})

describe('authorizedRequest', () => {
  it('refreshes once and repeats the request when the access token expired', async () => {
    saveTokens({ accessToken: 'expired', refreshToken: 'r' })
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(401, { error: { code: 'INVALID_ACCESS_TOKEN', message: 'Expired' } }))
      .mockResolvedValueOnce(jsonResponse(200, { accessToken: 'fresh', refreshToken: 'r2', user: USER }))
      .mockResolvedValueOnce(jsonResponse(200, USER))
    vi.stubGlobal('fetch', fetchMock)

    await expect(authorizedRequest('/api/users/me')).resolves.toEqual(USER)
    expect(fetchMock).toHaveBeenCalledTimes(3)
    expect(fetchMock.mock.calls[2][1].headers.Authorization).toBe('Bearer fresh')
  })
})
