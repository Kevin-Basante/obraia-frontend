import { LineArt } from '../art/LineArt.jsx'
import { materialArt } from '../../utils/artFor.js'
import { formatCurrency, formatDate } from '../../utils/format.js'
import './MaterialGrid.css'
import { codeLabel, t } from '../../i18n/i18n.js'

/** Materials as cards, each one with its drawing, unit and reference price. */
export function MaterialGrid({ materials, updating }) {
  return (
    <ul className={`material-grid${updating ? ' material-grid--updating' : ''}`}>
      {materials.map((material, index) => (
        <li key={material.id} className="material-card" style={{ '--step': index }}>
          <div className="material-card__art">
            <LineArt set="material" art={materialArt(material)} />
          </div>
          <div className="material-card__body">
            <span className="tech-label">{codeLabel('materialCategory', material.category)}</span>
            <h3>{material.name}</h3>
            <p className="material-card__price">
              {formatCurrency(material.referencePrice)}
              <span className="muted"> / {material.unit}</span>
            </p>
            <p className="muted material-card__date">
              {t('materialGrid.priceOf')} {formatDate(material.priceUpdatedAt)}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
