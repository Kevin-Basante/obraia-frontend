import { measurementSourceText } from '../../utils/analysis.js'
import { daysSourceText, formatRate } from '../../utils/budget.js'
import './QuotationFacts.css'

/** The data the backend used for the quotation: city, transport rate, working days and measurements. */
export function QuotationFacts({ quotation }) {
  return (
    <dl className="quotation-facts">
      <div>
        <dt>City</dt>
        <dd>{quotation.city}</dd>
      </div>
      <div>
        <dt>Transport</dt>
        <dd>{formatRate(quotation.transportPct)} of the materials</dd>
      </div>
      <div>
        <dt>Working days</dt>
        <dd>
          {quotation.workingDays} <span className="muted">{daysSourceText(quotation.workingDaysSource)}</span>
        </dd>
      </div>
      {quotation.measurementSource && (
        <div>
          <dt>Measurements</dt>
          <dd>{measurementSourceText(quotation.measurementSource)}</dd>
        </div>
      )}
    </dl>
  )
}
