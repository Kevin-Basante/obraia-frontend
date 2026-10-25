import { Link } from 'react-router'
import './PageHeader.css'

/** Title of a page, with an optional link back and the main actions on the right. */
export function PageHeader({ title, description, back, actions }) {
  return (
    <header className="page-header">
      {back && (
        <Link to={back.to} className="page-header__back">
          ← {back.label}
        </Link>
      )}
      <div className="page-header__row">
        <h1>{title}</h1>
        {actions && <div className="page-header__actions">{actions}</div>}
      </div>
      {description && <p className="muted">{description}</p>}
    </header>
  )
}
