// The theme is light or dark. Until the user picks one with the button, it
// follows the system; the choice is kept in localStorage for the next visit.
// index.html reads the same key before React starts, so the page does not flash.
export const THEME_KEY = 'obraia.theme'

const THEMES = ['light', 'dark']

/** The saved theme, or null when the user never picked one or storage is blocked. */
export function savedTheme(storage = globalThis.localStorage) {
  try {
    const value = storage?.getItem(THEME_KEY)
    return THEMES.includes(value) ? value : null
  } catch {
    return null
  }
}

/** Keeps the choice; when storage is blocked it lasts until the page reloads. */
export function saveTheme(theme, storage = globalThis.localStorage) {
  try {
    storage?.setItem(THEME_KEY, theme)
  } catch {
    // Ignored: see savedTheme.
  }
}

/** "dark" when the system asks for a dark theme, otherwise "light". */
export function systemTheme(matchMedia = globalThis.matchMedia) {
  return matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** The theme to start with: the saved one, or the one of the system. */
export function initialTheme(storage, matchMedia) {
  return savedTheme(storage) ?? systemTheme(matchMedia)
}

/** light -> dark, dark -> light. */
export function otherTheme(theme) {
  return theme === 'dark' ? 'light' : 'dark'
}
