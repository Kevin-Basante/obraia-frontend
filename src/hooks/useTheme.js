import { useEffect, useState } from 'react'
import { initialTheme, otherTheme, saveTheme, savedTheme, systemTheme } from '../utils/theme.js'

/** Current theme and a function to switch it; the theme is set on <html data-theme>. */
export function useTheme() {
  const [theme, setTheme] = useState(() => initialTheme())

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // While the user has not picked a theme, follow the system when it changes.
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!query) return undefined
    const follow = () => {
      if (savedTheme() === null) setTheme(systemTheme())
    }
    query.addEventListener('change', follow)
    return () => query.removeEventListener('change', follow)
  }, [])

  function toggleTheme() {
    const next = otherTheme(theme)
    saveTheme(next)
    setTheme(next)
  }

  return { theme, toggleTheme }
}
