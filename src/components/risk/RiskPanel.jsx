import { useCallback } from 'react'
import { FormAlert } from '../FormAlert.jsx'
import { StatusBadge } from '../projects/StatusBadge.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { assessRisk, getRiskOverview } from '../../services/riskService.js'
import { formatDateTime } from '../../utils/format.js'
import { delayText, factorDetail, formatScore, sortFactors, triggerText } from '../../utils/risk.js'
import { RiskChart } from './RiskChart.jsx'
import { RiskFactorTable } from './RiskFactorTable.jsx'
import './RiskPanel.css'
import { t } from '../../i18n/i18n.js'

/**
 * Risk of delay and of going over budget. The backend assesses it again
 * after every expense and progress report; the button asks for one now.
 * `onAssessed` lets the page refresh what depends on the risk.
 */
export function RiskPanel({ projectId, onAssessed }) {
  const overview = useApiData((signal) => getRiskOverview(projectId, { signal }), [projectId])
  const { retry } = overview
  const assess = useCallback(
    () =>
      assessRisk(projectId).then(() => {
        retry()
        onAssessed?.()
      }),
    [projectId, retry, onAssessed],
  )
  const assessing = useFormSubmit(assess)

  const latest = overview.data?.latest
  const history = overview.data?.history ?? []

  return (
    <section className="card" aria-live="polite">
      <h2>{t('riskPanel.risk')}</h2>
      {overview.status === 'error' && <FormAlert>{overview.error.message}</FormAlert>}
      {!overview.data && overview.status === 'loading' && <p className="muted">{t('riskPanel.loadingTheRisk')}</p>}
      {overview.data && !latest && <p className="muted">{t('riskPanel.theRiskHasNotBeen')}</p>}
      {latest && (
        <>
          <div className="risk-panel__headline">
            <StatusBadge status={latest.level} />
            <span className="risk-panel__score">
              {formatScore(latest.score)} <small>{t('riskPanel.of100')}</small>
            </span>
            <span>{delayText(latest.predictedDelayDays)}</span>
          </div>
          <p className="muted">
            {t('riskPanel.summary', {
              reason: latest.factors.length > 0 ? factorDetail(sortFactors(latest.factors)[0]) : '',
              date: formatDateTime(latest.assessedAt),
              trigger: triggerText(latest.trigger.code).toLowerCase(),
            })}
          </p>
          <RiskFactorTable factors={latest.factors} />
          {history.length > 1 && (
            <>
              <h3>{t('riskPanel.history')}</h3>
              <RiskChart history={history} />
            </>
          )}
        </>
      )}
      <FormAlert>{assessing.error?.message}</FormAlert>
      <div className="button-row">
        <button
          type="button"
          className="button-secondary"
          disabled={assessing.pending}
          onClick={() => assessing.submit()}
        >
          {assessing.pending ? t('riskPanel.assessing') : t('riskPanel.assessNow')}
        </button>
      </div>
    </section>
  )
}
