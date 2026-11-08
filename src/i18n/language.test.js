import { describe, expect, it } from 'vitest'
import {
  LANGUAGE_KEY,
  browserLanguage,
  initialLanguage,
  otherLanguage,
  saveLanguage,
  savedLanguage,
} from './language.js'

function memoryStorage(values = {}) {
  return {
    getItem: (key) => values[key] ?? null,
    setItem: (key, value) => {
      values[key] = value
    },
  }
}

const blocked = {
  getItem() {
    throw new Error('blocked')
  },
  setItem() {
    throw new Error('blocked')
  },
}

describe('language', () => {
  it('keeps the language the user picked', () => {
    const storage = memoryStorage()
    saveLanguage('es', storage)
    expect(savedLanguage(storage)).toBe('es')
    expect(initialLanguage(storage, ['en-US'])).toBe('es')
  })

  it('ignores a saved value that is not a language of the site', () => {
    expect(savedLanguage(memoryStorage({ [LANGUAGE_KEY]: 'fr' }))).toBeNull()
  })

  it('works when the browser blocks the storage', () => {
    expect(() => saveLanguage('es', blocked)).not.toThrow()
    expect(savedLanguage(blocked)).toBeNull()
  })

  it('starts in Spanish when the browser prefers it', () => {
    expect(browserLanguage(['es-CO', 'en'])).toBe('es')
    expect(browserLanguage(['en-US', 'es'])).toBe('en')
    expect(browserLanguage([])).toBe('en')
    expect(browserLanguage(null)).toBe('en')
    expect(initialLanguage(memoryStorage(), ['es'])).toBe('es')
  })

  it('switches between the two languages', () => {
    expect(otherLanguage('en')).toBe('es')
    expect(otherLanguage('es')).toBe('en')
  })
})
