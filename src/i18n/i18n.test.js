import { afterEach, describe, expect, it } from 'vitest'
import { codeLabel, codeText, dateLocale, getLanguage, hasText, setLanguage, t } from './i18n.js'
import en from './en.json'
import es from './es.json'

// Every key of en.json, with its path: "header.catalog".
function keys(node, prefix = '') {
  return Object.entries(node).flatMap(([key, value]) =>
    typeof value === 'object' && !('other' in value) ? keys(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  )
}

describe('i18n', () => {
  afterEach(() => setLanguage('en'))

  it('gives the text of a key in the current language', () => {
    expect(t('common.retry')).toBe('Retry')
    setLanguage('es')
    expect(getLanguage()).toBe('es')
    expect(t('common.retry')).toBe('Reintentar')
  })

  it('fills the values of a text', () => {
    expect(t('language.switchTo', { language: 'Spanish' })).toBe('Switch to Spanish')
    expect(t('language.switchTo')).toBe('Switch to {language}')
  })

  it('picks the singular or the plural with count', () => {
    expect(t('resultCount.city', { count: 1 })).toBe('1 city')
    expect(t('resultCount.city', { count: 3 })).toBe('3 cities')
    setLanguage('es')
    expect(t('resultCount.city', { count: 3 })).toBe('3 ciudades')
  })

  it('returns the key when there is no text, so a missing one is easy to see', () => {
    expect(t('nothing.here')).toBe('nothing.here')
    expect(hasText('nothing.here')).toBe(false)
    expect(hasText('common.retry')).toBe(true)
  })

  it('only accepts the two languages of the site', () => {
    setLanguage('fr')
    expect(getLanguage()).toBe('en')
  })

  it('writes dates in the format of the language', () => {
    expect(dateLocale()).toBe('en-US')
    setLanguage('es')
    expect(dateLocale()).toBe('es-CO')
  })

  it('translates the codes of the backend and keeps the label of unknown ones', () => {
    setLanguage('es')
    expect(codeLabel('status', { code: 'in_progress', label: 'In progress' })).toBe('En curso')
    expect(codeText('element', 'wall', 'Walls')).toBe('Muros')
    expect(codeText('element', 'stairs', 'Stairs')).toBe('Stairs')
    expect(codeText('element', 'stairs')).toBe('stairs')
  })

  it('has the same keys in English and Spanish', () => {
    expect(keys(es)).toEqual(keys(en))
  })
})
