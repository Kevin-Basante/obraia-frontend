import { useContext } from 'react'
import { LanguageContext } from '../context/LanguageContext.js'

/** Current language and changeLanguage(language). */
export function useLanguage() {
  return useContext(LanguageContext)
}
