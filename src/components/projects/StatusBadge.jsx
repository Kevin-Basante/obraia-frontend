import './StatusBadge.css'
import { codeLabel } from '../../i18n/i18n.js'

/** Colored label with a status ({ code, label } from the backend) of a project, phase, task or budget. */
export function StatusBadge({ status }) {
  return <span className={`status-badge status-badge--${status.code}`}>{codeLabel('status', status)}</span>
}
