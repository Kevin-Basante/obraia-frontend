import { LANGUAGES } from './i18n.js'

// Until the user picks a language with the button, the browser decides:
// Spanish when it prefers Spanish, English otherwise. The choice is kept in localStorage.
export const LANGUAGE_KEY = 'obraia.language'

/** The saved language, or null when the user never picked one or storage is blocked. */
export function savedLanguage(storage = globalThis.localStorage) {
  try {
    const value = storage?.getItem(LANGUAGE_KEY)
    return LANGUAGES.includes(value) ? value : null
  } catch {
    return null
  }
}

/** Keeps the choice; when storage is blocked it lasts until the page reloads. */
export function saveLanguage(language, storage = globalThis.localStorage) {
  try {
    storage?.setItem(LANGUAGE_KEY, language)
  } catch {
    // Ignored: see savedLanguage.
  }
}

/** "es" when the browser prefers Spanish (es, es-CO...), otherwise "en". */
export function browserLanguage(languages = globalThis.navigator?.languages) {
  const first = languages?.[0] ?? ''
  return first.toLowerCase().startsWith('es') ? 'es' : 'en'
}

/** The language to start with: the saved one, or the one of the browser. */
export function initialLanguage(storage, languages) {
  return savedLanguage(storage) ?? browserLanguage(languages)
}

/** en -> es, es -> en. */
export function otherLanguage(language) {
  return language === 'es' ? 'en' : 'es'
}
