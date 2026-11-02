import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { changePassword, getCurrentUser, updateProfile } from './userService.js'

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

/** Path, method and body of the request that the service sent. */
function sentRequest() {
  const [url, init] = fetchMock.mock.calls[0]
  return { path: new URL(url).pathname, method: init.method, body: init.body ? JSON.parse(init.body) : undefined }
}

describe('user services', () => {
  it('reads the profile of the signed-in user', async () => {
    await getCurrentUser()

    expect(sentRequest()).toEqual({ path: '/api/users/me', method: 'GET', body: undefined })
  })

  it('saves the profile with PUT', async () => {
    const profile = { firstName: 'Ana', lastName: 'Rojas', phone: '' }

    await updateProfile(profile)

    expect(sentRequest()).toEqual({ path: '/api/users/me', method: 'PUT', body: profile })
  })

  it('sends only the current and the new password', async () => {
    await changePassword({ currentPassword: 'old12345', newPassword: 'new12345', confirmPassword: 'new12345' })

    expect(sentRequest()).toEqual({
      path: '/api/users/me/password',
      method: 'POST',
      body: { currentPassword: 'old12345', newPassword: 'new12345' },
    })
  })
})
