import { Link } from 'react-router'
import { formatDateTime, formatFileSize } from '../../utils/format.js'
import { StatusBadge } from '../projects/StatusBadge.jsx'
import '../catalog/DataTable.css'

/** Blueprints of a project as a table. Each one opens its viewer; `onDelete` is left out when the project is closed. */
export function BlueprintList({ projectId, blueprints, onDelete, deleting }) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>File</th>
          <th>Type</th>
          <th className="data-table__number">Size</th>
          <th>Uploaded</th>
          <th>AI reading</th>
          <th>
            <span className="visually-hidden">Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {blueprints.map((blueprint) => (
          <tr key={blueprint.id}>
            <td data-label="File">
              <Link to={`/projects/${projectId}/blueprints/${blueprint.id}`}>{blueprint.originalFilename}</Link>
            </td>
            <td data-label="Type">{blueprint.fileTypeLabel}</td>
            <td data-label="Size" className="data-table__number">
              {formatFileSize(blueprint.sizeBytes)}
            </td>
            <td data-label="Uploaded">{formatDateTime(blueprint.uploadedAt)}</td>
            <td data-label="AI reading">
              <StatusBadge status={blueprint.processingStatus} />
            </td>
            <td data-label="Actions">
              {onDelete && (
                <button
                  type="button"
                  className="button-secondary button-small"
                  disabled={deleting}
                  onClick={() => onDelete(blueprint)}
                >
                  Delete
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
