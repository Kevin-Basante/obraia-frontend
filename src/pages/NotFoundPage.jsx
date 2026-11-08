import { Link } from 'react-router'
import { t } from '../i18n/i18n.js'

/** Any URL that does not match a page. */
export function NotFoundPage() {
  return (
    <section className="card">
      <h1>{t('states.notFound.title')}</h1>
      <p className="muted">{t('states.notFound.text')}</p>
      <Link to="/" className="button-link">
        {t('states.notFound.home')}
      </Link>
    </section>
  )
}
