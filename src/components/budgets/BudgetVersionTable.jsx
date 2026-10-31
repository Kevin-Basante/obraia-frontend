import { Link } from 'react-router'
import { formatCurrency, formatDateTime } from '../../utils/format.js'
import { StatusBadge } from '../projects/StatusBadge.jsx'
import '../catalog/DataTable.css'

/** Saved versions of the budget, newest first, each one with a link to its rows. */
export function BudgetVersionTable({ projectId, versions }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th scope="col">Version</th>
          <th scope="col">Status</th>
          <th scope="col" className="data-table__number">
            Projected amount
          </th>
          <th scope="col">Saved</th>
          <th scope="col">Approved</th>
        </tr>
      </thead>
      <tbody>
        {versions.map((version) => (
          <tr key={version.id}>
            <td data-label="Version">
              <Link to={`/projects/${projectId}/budgets/${version.id}`}>Version {version.version}</Link>
            </td>
            <td data-label="Status">
              <StatusBadge status={version.status} />
            </td>
            <td data-label="Projected amount" className="data-table__number">
              {formatCurrency(version.projectedAmount)}
            </td>
            <td data-label="Saved">{formatDateTime(version.createdAt)}</td>
            <td data-label="Approved">{version.approvedAt ? formatDateTime(version.approvedAt) : '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
