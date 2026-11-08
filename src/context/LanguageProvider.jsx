import { useEffect, useState } from 'react'
import { setLanguage } from '../i18n/i18n.js'
import { initialLanguage, saveLanguage } from '../i18n/language.js'
import { LanguageContext } from './LanguageContext.js'

/** Keeps the language of the app; every page that reads it is drawn again when it changes. */
export function LanguageProvider({ children }) {
  const [language, setCurrent] = useState(() => initialLanguage())
  // t() reads the language while the pages render, so it is set before them.
  setLanguage(language)

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  function changeLanguage(next) {
    saveLanguage(next)
    setCurrent(next)
  }

  return <LanguageContext.Provider value={{ language, changeLanguage }}>{children}</LanguageContext.Provider>
}
