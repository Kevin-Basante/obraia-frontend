import { useLanguage } from '../../hooks/useLanguage.js'
import { LanguageButton } from './LanguageButton.jsx'

/** Button of the top bar that switches between English and Spanish. */
export function LanguageToggle() {
  const { language, changeLanguage } = useLanguage()
  return <LanguageButton language={language} onChange={changeLanguage} />
}
