import { t } from '../../i18n/i18n.js'
import { otherLanguage } from '../../i18n/language.js'
import './LanguageButton.css'

/** Shows the language it switches to: "ES" while the app is in English and "EN" while it is in Spanish. */
export function LanguageButton({ language, onChange }) {
  const next = otherLanguage(language)

  return (
    <button
      type="button"
      className="language-button"
      onClick={() => onChange(next)}
      aria-label={t('language.switchTo', { language: t(`language.names.${next}`) })}
      title={t('language.switchTo', { language: t(`language.names.${next}`) })}
    >
      {next.toUpperCase()}
    </button>
  )
}
