import { useCallback } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { StatusBadge } from '../projects/StatusBadge.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { assessRisk, getRiskOverview } from '../../services/riskService.js'
import { formatDateTime } from '../../utils/format.js'
import { delayText, formatScore, sortFactors } from '../../utils/risk.js'
import { RiskChart } from './RiskChart.jsx'
import { RiskFactorTable } from './RiskFactorTable.jsx'
import './RiskPanel.css'

/**
 * Risk of delay and of going over budget. The backend assesses it again
 * after every expense and progress report; the button asks for one now.
 */
export function RiskPanel({ projectId }) {
  const overview = useApiData((signal) => getRiskOverview(projectId, { signal }), [projectId])
  const { retry } = overview
  const assess = useCallback(() => assessRisk(projectId).then(retry), [projectId, retry])
  const assessing = useFormSubmit(assess)

  const latest = overview.data?.latest
  const history = overview.data?.history ?? []

  return (
    <section className="card" aria-live="polite">
      <h2>Risk</h2>
      {overview.status === 'error' && <FormAlert>{overview.error.message}</FormAlert>}
      {!overview.data && overview.status === 'loading' && <p className="muted">Loading the risk…</p>}
      {overview.data && !latest && (
        <p className="muted">
          The risk has not been assessed yet. It is assessed after every expense and progress report, or now with the
          button.
        </p>
      )}
      {latest && (
        <>
          <div className="risk-panel__headline">
            <StatusBadge status={latest.level} />
            <span className="risk-panel__score">
              {formatScore(latest.score)} <small>of 100</small>
            </span>
            <span>{delayText(latest.predictedDelayDays)}</span>
          </div>
          <p className="muted">
            {sortFactors(latest.factors)[0]?.detail}. Assessed {formatDateTime(latest.assessedAt)} ·{' '}
            {latest.trigger.label.toLowerCase()}.
          </p>
          <RiskFactorTable factors={latest.factors} />
          {history.length > 1 && (
            <>
              <h3>History</h3>
              <RiskChart history={history} />
            </>
          )}
        </>
      )}
      <FormAlert>{assessing.error?.message}</FormAlert>
      <div className="button-row">
        <button type="button" className="button-secondary" disabled={assessing.pending} onClick={() => assessing.submit()}>
          {assessing.pending ? 'Assessing…' : 'Assess now'}
        </button>
      </div>
    </section>
  )
}
