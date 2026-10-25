/** "3 materials" above a list; announced to screen readers when the filters change. */
export function ResultCount({ count, singular, plural, updating }) {
  return (
    <p className="muted" aria-live="polite">
      {count} {count === 1 ? singular : plural}
      {updating && ' · updating…'}
    </p>
  )
}
