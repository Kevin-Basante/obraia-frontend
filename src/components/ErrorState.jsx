import { API_URL } from '../config/env.js'
import './ErrorState.css'
import { t } from '../i18n/i18n.js'

/** Shown when the backend does not answer or returns an error. */
export function ErrorState({ error, onRetry }) {
  return (
    <section className="card error-state" role="alert">
      <h1>{t('states.errorTitle')}</h1>
      <p className="error-state__message">{error?.message ?? t('common.unknownError')}</p>
      <p className="muted">{t('states.backendHint', { url: API_URL })}</p>
      <button type="button" onClick={onRetry}>
        {t('common.retry')}
      </button>
    </section>
  )
}
