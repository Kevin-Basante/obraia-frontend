import { afterEach, describe, expect, it, vi } from 'vitest'
import { clearTokens, getAccessToken, getRefreshToken, saveTokens } from './tokenStorage.js'

function memoryStorage() {
  const items = new Map()
  return {
    getItem: (key) => (items.has(key) ? items.get(key) : null),
    setItem: (key, value) => items.set(key, String(value)),
    removeItem: (key) => items.delete(key),
  }
}

function blockedStorage() {
  const blocked = () => {
    throw new Error('blocked')
  }
  return { getItem: blocked, setItem: blocked, removeItem: blocked }
}

afterEach(() => {
  clearTokens()
  vi.unstubAllGlobals()
})

describe('tokenStorage', () => {
  it('keeps the access token in memory and the refresh token in storage', () => {
    const storage = memoryStorage()
    vi.stubGlobal('localStorage', storage)

    saveTokens({ accessToken: 'a1', refreshToken: 'r1' })

    expect(getAccessToken()).toBe('a1')
    expect(getRefreshToken()).toBe('r1')
    expect(storage.getItem('obraia.refreshToken')).toBe('r1')
  })

  it('clears both tokens', () => {
    vi.stubGlobal('localStorage', memoryStorage())
    saveTokens({ accessToken: 'a1', refreshToken: 'r1' })

    clearTokens()

    expect(getAccessToken()).toBeNull()
    expect(getRefreshToken()).toBeNull()
  })

  it('still works in memory when the storage is blocked', () => {
    vi.stubGlobal('localStorage', blockedStorage())

    saveTokens({ accessToken: 'a1', refreshToken: 'r1' })

    expect(getAccessToken()).toBe('a1')
    expect(getRefreshToken()).toBeNull()
    expect(() => clearTokens()).not.toThrow()
  })
})
