import { useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { BlueprintViewer } from '../../components/blueprints/BlueprintViewer.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { listBlueprints } from '../../services/blueprintService.js'
import { formatDateTime, formatFileSize } from '../../utils/format.js'
import { NotFoundPage } from '../NotFoundPage.jsx'

/** One blueprint shown inside the page, with its data. */
export function BlueprintViewPage() {
  const { id, blueprintId } = useParams()
  const blueprints = useApiData((signal) => listBlueprints(id, { signal }), [id])

  if (blueprints.error?.status === 404) return <NotFoundPage />
  if (blueprints.status === 'error') return <ErrorState error={blueprints.error} onRetry={blueprints.retry} />
  if (!blueprints.data) return <LoadingState title="Loading the blueprint…" />

  const blueprint = blueprints.data.find((item) => item.id === blueprintId)
  if (!blueprint) return <NotFoundPage />

  return (
    <div className="workspace">
      <PageHeader
        title={blueprint.originalFilename}
        description={`${blueprint.fileTypeLabel} · ${formatFileSize(blueprint.sizeBytes)} · Uploaded ${formatDateTime(blueprint.uploadedAt)}`}
        back={{ to: `/projects/${id}/blueprints`, label: 'Blueprints' }}
      />
      <BlueprintViewer projectId={id} blueprint={blueprint} />
    </div>
  )
}
