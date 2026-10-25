import './LoadingState.css'

/** Shown while a request to the backend is in progress. */
export function LoadingState({
  title = 'Connecting to the server…',
  message = 'If the server was asleep, the first response can take about a minute.',
}) {
  return (
    <section className="card" aria-live="polite">
      <div className="spinner" aria-hidden="true" />
      <h1>{title}</h1>
      {message && <p className="muted">{message}</p>}
    </section>
  )
}
