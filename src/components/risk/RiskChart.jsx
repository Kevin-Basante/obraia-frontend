import { formatDateTime } from '../../utils/format.js'
import { chartPoints, formatScore, triggerText } from '../../utils/risk.js'
import './RiskChart.css'

// Small drawing, scaled up to at most 640 px, so the labels can still be read on phones.
const WIDTH = 420
const HEIGHT = 120
const LEFT = 28
// Lines at the limits of the levels: low under 25, medium under 50, high under 75.
const LEVEL_LINES = [25, 50, 75]

/** The score of each assessment, the oldest on the left. Each point says when and why it was made. */
export function RiskChart({ history }) {
  const points = chartPoints(history, WIDTH - LEFT - 8, HEIGHT).map((point) => ({ ...point, x: point.x + LEFT }))

  return (
    <svg
      className="risk-chart"
      viewBox={`0 -8 ${WIDTH} ${HEIGHT + 16}`}
      role="img"
      aria-label={`Risk score of the last ${history.length} assessments`}
    >
      {LEVEL_LINES.map((level) => {
        const y = HEIGHT - (level / 100) * HEIGHT
        return (
          <g key={level}>
            <line className="risk-chart__grid" x1={LEFT} x2={WIDTH} y1={y} y2={y} />
            <text className="risk-chart__label" x={0} y={y + 4}>
              {level}
            </text>
          </g>
        )
      })}
      <polyline className="risk-chart__line" points={points.map((point) => `${point.x},${point.y}`).join(' ')} />
      {points.map((point) => (
        <circle key={point.assessedAt} className="risk-chart__point" cx={point.x} cy={point.y} r={4}>
          <title>
            {`${formatDateTime(point.assessedAt)} · ${formatScore(point.score)} · ${triggerText(point.trigger)}`}
          </title>
        </circle>
      ))}
    </svg>
  )
}
