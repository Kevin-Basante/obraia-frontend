import { daysSourceText, formatRate } from '../../utils/budget.js'
import './QuotationFacts.css'

/** The data the backend used for the quotation: city, transport rate and working days. */
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
    </dl>
  )
}
