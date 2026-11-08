import { t } from '../i18n/i18n.js'
/** Form button that is disabled and changes its text while the request runs. */
export function SubmitButton({ pending, children, pendingText = t('common.pleaseWait') }) {
  return (
    <button type="submit" className="submit-button" disabled={pending} aria-busy={pending}>
      {pending ? pendingText : children}
    </button>
  )
}
