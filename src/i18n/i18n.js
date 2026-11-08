import en from './en.json'
import es from './es.json'

// Every text of the interface lives in en.json and es.json, under a key in English.
// The code asks for a key with t('header.catalog'); the current language picks the file.
// English is the base: a key missing in es.json falls back to it.
const MESSAGES = { en, es }

export const LANGUAGES = ['en', 'es']

let current = 'en'

/** Changes the language of t(); LanguageProvider calls it and draws the app again. */
export function setLanguage(language) {
  current = LANGUAGES.includes(language) ? language : 'en'
}

export function getLanguage() {
  return current
}

/** Locale for dates: "Nov 7, 2026" in English and "7 nov 2026" in Spanish. */
export function dateLocale() {
  return current === 'es' ? 'es-CO' : 'en-US'
}

function lookup(messages, key) {
  return key.split('.').reduce((node, part) => (node == null ? undefined : node[part]), messages)
}

function pick(value, params) {
  if (value && typeof value === 'object' && params?.count !== undefined) {
    return params.count === 1 ? value.one : value.other
  }
  return value
}

function fill(text, params) {
  if (!params) return text
  return text.replace(/\{(\w+)\}/g, (match, name) => (params[name] === undefined ? match : String(params[name])))
}

/**
 * Text of a key in the current language, with {name} replaced by params.name.
 * With params.count, an entry { one, other } picks the singular or the plural.
 */
export function t(key, params) {
  const value = pick(lookup(MESSAGES[current], key), params) ?? pick(lookup(MESSAGES.en, key), params)
  return typeof value === 'string' ? fill(value, params) : key
}

/** Whether a key exists, to translate values from the backend only when there is a text for them. */
export function hasText(key) {
  return typeof lookup(MESSAGES.en, key) === 'string' || typeof lookup(MESSAGES.en, key) === 'object'
}

/**
 * Label of a code from the backend in the current language, for example
 * codeText('element', 'wall', 'Walls'). Unknown codes keep the label of the backend.
 */
export function codeText(group, code, fallback) {
  const key = `codes.${group}.${code}`
  return hasText(key) ? t(key) : (fallback ?? code)
}

/** Same as codeText for a { code, label } value, for example codeLabel('status', project.status). */
export function codeLabel(group, value) {
  return codeText(group, value.code, value.label)
}
