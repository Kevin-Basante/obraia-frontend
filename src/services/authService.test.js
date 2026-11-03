import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  forgotPassword,
  login,
  logout,
  refresh,
  register,
  resendVerification,
  resetPassword,
  verifyEmail,
} from './authService.js'

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

describe('auth services', () => {
  it('registers with an empty phone sent as null', async () => {
    await register({ firstName: 'Ana', lastName: 'Ruiz', email: 'ana@test.co', password: 'Secret123', phone: '' })

    expect(sentRequest()).toEqual({
      path: '/api/auth/register',
      method: 'POST',
      body: { firstName: 'Ana', lastName: 'Ruiz', email: 'ana@test.co', password: 'Secret123', phone: null },
    })
  })

  it('signs in with email and password', async () => {
    await login('ana@test.co', 'Secret123')

    expect(sentRequest()).toEqual({
      path: '/api/auth/login',
      method: 'POST',
      body: { email: 'ana@test.co', password: 'Secret123' },
    })
  })

  it('verifies the email and resends the link', async () => {
    await verifyEmail('t1')
    await resendVerification('ana@test.co')

    expect(sentRequest(0)).toEqual({ path: '/api/auth/verify-email', method: 'POST', body: { token: 't1' } })
    expect(sentRequest(1)).toEqual({
      path: '/api/auth/resend-verification',
      method: 'POST',
      body: { email: 'ana@test.co' },
    })
  })

  it('renews and closes the session with the refresh token', async () => {
    await refresh('r1')
    await logout('r1')

    expect(sentRequest(0)).toEqual({ path: '/api/auth/refresh', method: 'POST', body: { refreshToken: 'r1' } })
    expect(sentRequest(1)).toEqual({ path: '/api/auth/logout', method: 'POST', body: { refreshToken: 'r1' } })
  })

  it('asks for and sets a new password', async () => {
    await forgotPassword('ana@test.co')
    await resetPassword('t2', 'NewSecret123')

    expect(sentRequest(0)).toEqual({
      path: '/api/auth/forgot-password',
      method: 'POST',
      body: { email: 'ana@test.co' },
    })
    expect(sentRequest(1)).toEqual({
      path: '/api/auth/reset-password',
      method: 'POST',
      body: { token: 't2', newPassword: 'NewSecret123' },
    })
  })
})
