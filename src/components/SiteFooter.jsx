import { BrandLogo } from './BrandLogo.jsx'
import './SiteFooter.css'
import { t } from '../i18n/i18n.js'

/** Bottom of every page. */
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <BrandLogo size={26} />
        <span>ObraIA</span>
      </div>
      <p>{t('footer.tagline')}</p>
      <p className="site-footer__team">{t('footer.team')}</p>
    </footer>
  )
}
