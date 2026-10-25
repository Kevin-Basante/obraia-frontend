/** Shown when the filters leave the list empty. */
export function EmptyState({ children }) {
  return (
    <section className="card">
      <p className="muted">{children}</p>
    </section>
  )
}
