import { API_URL } from '../config/env.js'
import './ErrorState.css'

/** Shown when the backend does not answer or returns an error. */
export function ErrorState({ error, onRetry }) {
  return (
    <section className="card error-state" role="alert">
      <h1>Could not load the data</h1>
      <p className="error-state__message">{error?.message ?? 'Unknown error'}</p>
      <p className="muted">Make sure the backend is running at {API_URL}</p>
      <button type="button" onClick={onRetry}>
        Retry
      </button>
    </section>
  )
}
