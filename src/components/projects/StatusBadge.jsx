import './StatusBadge.css'

/** Colored label with the status of a project: { code, label } from the backend. */
export function StatusBadge({ status }) {
  return <span className={`status-badge status-badge--${status.code}`}>{status.label}</span>
}
