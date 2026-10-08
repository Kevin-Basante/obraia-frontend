import './HelloCard.css'

/** Shows the backend response: the message and the data read from the database. */
export function HelloCard({ data }) {
  const { database } = data

  return (
    <section className="card" aria-live="polite">
      <h1>{data.message}</h1>
      <dl className="facts">
        <div>
          <dt>Project</dt>
          <dd>{data.project}</dd>
        </div>
        <div>
          <dt>Database</dt>
          <dd className="facts__ok">Connected</dd>
        </div>
        <div>
          <dt>Tables</dt>
          <dd>{database.tables}</dd>
        </div>
        <div>
          <dt>Response time</dt>
          <dd>{database.latencyMs} ms</dd>
        </div>
        <div className="facts__wide">
          <dt>Project types</dt>
          <dd>{database.projectTypes.join(', ')}</dd>
        </div>
      </dl>
    </section>
  )
}
