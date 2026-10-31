import { formatProgress } from '../../utils/workStatus.js'
import './ProgressBar.css'

/** Horizontal bar from 0 to 100 with the percentage on its right. */
export function ProgressBar({ value, label = 'Progress' }) {
  const percent = Math.min(100, Math.max(0, Number(value)))
  return (
    <div className="progress-bar">
      <div
        className="progress-bar__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <span className="progress-bar__fill" style={{ width: `${percent}%` }} />
      </div>
      <span className="progress-bar__value">{formatProgress(percent)}</span>
    </div>
  )
}
