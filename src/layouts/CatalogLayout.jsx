import { NavLink, Outlet } from 'react-router'
import './CatalogLayout.css'
import { t } from '../i18n/i18n.js'

/** Frame of the catalog pages: title and tabs to move between them. */
export function CatalogLayout() {
  return (
    <div className="catalog">
      <header className="catalog__header">
        <h1>{t('catalogLayout.catalog')}</h1>
        <p className="muted">{t('catalogLayout.referenceDataUsedToPlan')}</p>
      </header>
      <nav className="catalog__tabs" aria-label={t('catalogLayout.catalogSections')}>
        <NavLink to="/catalog/materials">{t('catalogLayout.materials')}</NavLink>
        <NavLink to="/catalog/project-types">{t('catalogLayout.projectTypes')}</NavLink>
        <NavLink to="/catalog/cities">{t('catalogLayout.cities')}</NavLink>
      </nav>
      <Outlet />
    </div>
  )
}
