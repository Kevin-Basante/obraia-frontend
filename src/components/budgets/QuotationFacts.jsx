import { measurementSourceText } from '../../utils/analysis.js'
import { daysSourceText, formatRate } from '../../utils/budget.js'
import './QuotationFacts.css'
import { t } from '../../i18n/i18n.js'

/** The data the backend used for the quotation: city, transport rate, working days and measurements. */
export function QuotationFacts({ quotation }) {
  return (
    <dl className="quotation-facts">
      <div>
        <dt>{t('quotationFacts.city')}</dt>
        <dd>{quotation.city}</dd>
      </div>
      <div>
        <dt>{t('quotationFacts.transport')}</dt>
        <dd>{t('quotationFacts.ofMaterials', { rate: formatRate(quotation.transportPct) })}</dd>
      </div>
      <div>
        <dt>{t('quotationFacts.workingDays')}</dt>
        <dd>
          {quotation.workingDays} <span className="muted">{daysSourceText(quotation.workingDaysSource)}</span>
        </dd>
      </div>
      {quotation.measurementSource && (
        <div>
          <dt>{t('quotationFacts.measurements')}</dt>
          <dd>{measurementSourceText(quotation.measurementSource)}</dd>
        </div>
      )}
    </dl>
  )
}
