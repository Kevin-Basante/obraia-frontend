import { describe, expect, it } from 'vitest'
import { THEME_KEY, initialTheme, otherTheme, saveTheme, savedTheme, systemTheme } from './theme.js'

function memoryStorage(values = {}) {
  return {
    getItem: (key) => values[key] ?? null,
    setItem: (key, value) => {
      values[key] = value
    },
  }
}

const blockedStorage = {
  getItem: () => {
    throw new Error('blocked')
  },
  setItem: () => {
    throw new Error('blocked')
  },
}

const prefersDark = () => ({ matches: true })
const prefersLight = () => ({ matches: false })

describe('theme', () => {
  it('reads only a valid saved theme', () => {
    expect(savedTheme(memoryStorage({ [THEME_KEY]: 'dark' }))).toBe('dark')
    expect(savedTheme(memoryStorage({ [THEME_KEY]: 'blue' }))).toBeNull()
    expect(savedTheme(memoryStorage())).toBeNull()
  })

  it('has no saved theme when storage is blocked', () => {
    expect(savedTheme(blockedStorage)).toBeNull()
    expect(() => saveTheme('dark', blockedStorage)).not.toThrow()
  })

  it('saves the theme under its key', () => {
    const values = {}
    saveTheme('light', memoryStorage(values))

    expect(values[THEME_KEY]).toBe('light')
  })

  it('follows the system until the user picks a theme', () => {
    expect(systemTheme(prefersDark)).toBe('dark')
    expect(systemTheme(prefersLight)).toBe('light')
    expect(systemTheme(undefined)).toBe('light')
    expect(initialTheme(memoryStorage(), prefersDark)).toBe('dark')
    expect(initialTheme(memoryStorage({ [THEME_KEY]: 'light' }), prefersDark)).toBe('light')
  })

  it('switches to the other theme', () => {
    expect(otherTheme('light')).toBe('dark')
    expect(otherTheme('dark')).toBe('light')
  })
})
