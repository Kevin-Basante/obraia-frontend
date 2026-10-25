import { Link } from 'react-router'

/** Any URL that does not match a page. */
export function NotFoundPage() {
  return (
    <section className="card">
      <h1>Page not found</h1>
      <p className="muted">The address may be mistyped, or the page was moved.</p>
      <Link to="/" className="button-link">
        Go to the home page
      </Link>
    </section>
  )
}
