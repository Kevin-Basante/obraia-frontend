import './AuthCard.css'

/** Frame shared by the account pages: title, short description, form and links below. */
export function AuthCard({ title, description, children, footer }) {
  return (
    <section className="card auth-card">
      <h1>{title}</h1>
      {description && <p className="muted">{description}</p>}
      {children}
      {footer && <div className="auth-card__footer">{footer}</div>}
    </section>
  )
}
