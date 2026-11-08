import { createContext } from 'react'

/** Current language ('en' or 'es') and the function to change it. Without a provider it is English. */
export const LanguageContext = createContext({ language: 'en', changeLanguage: () => {} })
