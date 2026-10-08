import './LoadingState.css'

/** Shown while the request to the backend is in progress. */
export function LoadingState() {
  return (
    <section className="card" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <h1>Connecting to the server…</h1>
      <p className="muted">If the server was asleep, the first response can take about a minute.</p>
    </section>
  )
}
