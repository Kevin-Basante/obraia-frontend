import { t } from '../../i18n/i18n.js'
/**
 * "3 materials" above a list; announced to screen readers when the filters change.
 * `noun` is the key of the word in resultCount: city, material or project.
 */
export function ResultCount({ count, noun, updating }) {
  return (
    <p className="muted" aria-live="polite">
      {t(`resultCount.${noun}`, { count })}
      {updating && t('resultCount.updating')}
    </p>
  )
}
