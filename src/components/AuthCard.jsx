import { BrandLogo } from './BrandLogo.jsx'
import './AuthCard.css'

const PROMISES = ['Measurements read by AI', 'Budgets with the prices of your city', 'Alerts before a delay']

/**
 * Frame shared by the account pages: on the left, what ObraIA is, over a
 * blueprint that draws itself; on the right, title, description, form and links.
 */
export function AuthCard({ title, description, children, footer }) {
  return (
    <section className="auth-card">
      <aside className="auth-card__art" aria-hidden="true">
        <div className="auth-card__brand">
          <BrandLogo size={40} />
          <span>ObraIA</span>
        </div>
        <svg viewBox="0 0 300 200" className="auth-card__plan">
          <path pathLength="1" d="M20 20H280V180H20Z" />
          <path pathLength="1" d="M130 20V80M130 120V180M130 110H280" />
          <path pathLength="1" className="auth-card__plan-detail" d="M130 80A40 40 0 0 0 90 120M20 196H280" />
        </svg>
        <p className="auth-card__quote">Plan it once. Build it right.</p>
        <ul className="auth-card__promises">
          {PROMISES.map((promise) => (
            <li key={promise}>{promise}</li>
          ))}
        </ul>
      </aside>
      <div className="auth-card__panel">
        <h1>{title}</h1>
        {description && <p className="muted">{description}</p>}
        {children}
        {footer && <div className="auth-card__footer">{footer}</div>}
      </div>
    </section>
  )
}
