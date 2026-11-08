import './LoadingState.css'
import { t } from '../i18n/i18n.js'

/** Shown while a request to the backend is in progress. */
export function LoadingState({ title = t('states.connecting'), message = t('states.wakeUp') }) {
  return (
    <section className="card" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <h1>{title}</h1>
      {message && <p className="muted">{message}</p>}
    </section>
  )
}
