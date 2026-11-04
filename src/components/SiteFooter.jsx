import { BrandLogo } from './BrandLogo.jsx'
import './SiteFooter.css'

/** Bottom of every page. */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <BrandLogo size={26} />
        <span>ObraIA</span>
      </div>
      <p>Plan, budget and track small construction projects</p>
      <p className="site-footer__team">Software Patterns final project · Kevin Basante and Arley Riascos</p>
    </footer>
  )
}
