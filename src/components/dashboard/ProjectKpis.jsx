import { ProgressBar } from '../phases/ProgressBar.jsx'
import { StatusBadge } from '../projects/StatusBadge.jsx'
import { lateTasksText, moneyLevel, moneyTone, planEndText, riskTone, tasksDoneText } from '../../utils/dashboard.js'
import { formatCurrency } from '../../utils/format.js'
import { delayText, formatScore } from '../../utils/risk.js'
import { formatProgress } from '../../utils/workStatus.js'
import { KpiTile } from './KpiTile.jsx'

function moneyValue(money) {
  const level = moneyLevel(money)
  if (level === 'none') return 'Not approved'
  return `${formatProgress(money.spentPct)} spent`
}

function moneyDetail(money) {
  if (money.approvedBudget === null) return `${formatCurrency(money.totalSpent)} spent, no budget to compare with`
  return `${formatCurrency(money.totalSpent)} of ${formatCurrency(money.approvedBudget)}`
}

/** The five key numbers of a project: progress, money, risk, schedule and what was recorded. */
export function ProjectKpis({ overview }) {
  const { work, money, risk, counts } = overview
  const measurements = counts.manualMeasurements + counts.aiMeasurements

  return (
    <div className="kpi-row">
      <KpiTile
        label="Progress"
        value={formatProgress(work.progressPct)}
        detail={tasksDoneText(work)}
        tone={work.lateTasks > 0 ? 'warn' : 'ok'}
      >
        <ProgressBar value={work.progressPct} label="Progress of the project" />
      </KpiTile>
      <KpiTile label="Budget" value={moneyValue(money)} detail={moneyDetail(money)} tone={moneyTone(money)}>
        {money.approvedBudget !== null && <ProgressBar value={money.spentPct} label="Approved budget spent" />}
      </KpiTile>
      <KpiTile
        label="Risk"
        value={risk ? `${formatScore(risk.score)} / 100` : 'Not assessed'}
        detail={risk ? delayText(risk.predictedDelayDays) : 'It is assessed after expenses and progress reports'}
        tone={riskTone(risk)}
      >
        {risk && (
          <span>
            <StatusBadge status={risk.level} />
          </span>
        )}
      </KpiTile>
      <KpiTile
        label="Current phase"
        value={work.currentPhase ?? (work.phaseCount > 0 ? 'All phases done' : 'No plan yet')}
        detail={`${lateTasksText(work.lateTasks)} · ${planEndText(work)}`}
        tone={work.lateTasks > 0 ? 'bad' : 'neutral'}
      />
      <KpiTile
        label="Records"
        value={`${measurements} ${measurements === 1 ? 'measurement' : 'measurements'}`}
        detail={`${counts.aiMeasurements} by AI · ${counts.blueprints} ${counts.blueprints === 1 ? 'blueprint' : 'blueprints'} · ${counts.members} ${counts.members === 1 ? 'member' : 'members'}`}
      />
    </div>
  )
}
