import { NavLink, Outlet } from 'react-router'
import './CatalogLayout.css'

/** Frame of the catalog pages: title and tabs to move between them. */
export function CatalogLayout() {
  return (
    <div className="catalog">
      <header className="catalog__header">
        <h1>Catalog</h1>
        <p className="muted">Reference data used to plan and quote your project. Prices are in COP and include VAT.</p>
      </header>
      <nav className="catalog__tabs" aria-label="Catalog sections">
        <NavLink to="/catalog/materials">Materials</NavLink>
        <NavLink to="/catalog/project-types">Project types</NavLink>
        <NavLink to="/catalog/cities">Cities</NavLink>
      </nav>
      <Outlet />
    </div>
  )
}
