import './AppHeader.css'

/** Brand name and a short description of the platform. */
export function AppHeader() {
  return (
    <header className="app-header">
      <p className="app-header__brand">ObraIA</p>
      <p className="app-header__tagline">Plan, budget and track small construction projects</p>
    </header>
  )
}
