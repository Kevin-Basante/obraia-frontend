import { ProgressBar } from '../phases/ProgressBar.jsx'
import { StatusBadge } from '../projects/StatusBadge.jsx'
import { lateTasksText, moneyLevel, moneyTone, planEndText, riskTone, tasksDoneText } from '../../utils/dashboard.js'
import { formatCurrency } from '../../utils/format.js'
import { delayText, formatScore } from '../../utils/risk.js'
import { formatProgress } from '../../utils/workStatus.js'
import { KpiTile } from './KpiTile.jsx'
import { t } from '../../i18n/i18n.js'

function moneyValue(money) {
  const level = moneyLevel(money)
  if (level === 'none') return t('projectKpis.notApproved')
  return t('projectKpis.spentValue', { share: formatProgress(money.spentPct) })
}

function moneyDetail(money) {
  if (money.approvedBudget === null) return t('projectKpis.spentNoBudget', { spent: formatCurrency(money.totalSpent) })
  return t('projectKpis.spentOf', {
    spent: formatCurrency(money.totalSpent),
    budget: formatCurrency(money.approvedBudget),
  })
}

/** The five key numbers of a project: progress, money, risk, schedule and what was recorded. */
export function ProjectKpis({ overview }) {
  const { work, money, risk, counts } = overview
  const measurements = counts.manualMeasurements + counts.aiMeasurements

  return (
    <div className="kpi-row">
      <KpiTile
        label={t('projectKpis.progress')}
        value={formatProgress(work.progressPct)}
        detail={tasksDoneText(work)}
        tone={work.lateTasks > 0 ? 'warn' : 'ok'}
      >
        <ProgressBar value={work.progressPct} label={t('projectKpis.progressOfTheProject')} />
      </KpiTile>
      <KpiTile
        label={t('projectKpis.budget')}
        value={moneyValue(money)}
        detail={moneyDetail(money)}
        tone={moneyTone(money)}
      >
        {money.approvedBudget !== null && (
          <ProgressBar value={money.spentPct} label={t('projectKpis.approvedBudgetSpent')} />
        )}
      </KpiTile>
      <KpiTile
        label={t('projectKpis.risk')}
        value={risk ? `${formatScore(risk.score)} / 100` : t('projectKpis.notAssessed')}
        detail={risk ? delayText(risk.predictedDelayDays) : t('projectKpis.itIsAssessedAfterExpenses')}
        tone={riskTone(risk)}
      >
        {risk && (
          <span>
            <StatusBadge status={risk.level} />
          </span>
        )}
      </KpiTile>
      <KpiTile
        label={t('projectKpis.currentPhase')}
        value={work.currentPhase ?? (work.phaseCount > 0 ? t('projectKpis.allPhasesDone') : t('projectKpis.noPlanYet'))}
        detail={`${lateTasksText(work.lateTasks)} · ${planEndText(work)}`}
        tone={work.lateTasks > 0 ? 'bad' : 'neutral'}
      />
      <KpiTile
        label={t('projectKpis.records')}
        value={t('projectKpis.measurements', { count: measurements })}
        detail={t('projectKpis.recordsDetail', {
          ai: counts.aiMeasurements,
          blueprints: t('projectKpis.blueprints', { count: counts.blueprints }),
          members: t('projectKpis.members', { count: counts.members }),
        })}
      />
    </div>
  )
}
