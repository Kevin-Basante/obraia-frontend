import { useEffect } from 'react'
import { ErrorState } from '../ErrorState.jsx'
import { LoadingState } from '../LoadingState.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { getBlueprintFile } from '../../services/blueprintService.js'
import { isImage } from '../../utils/blueprintFile.js'
import './BlueprintViewer.css'

/**
 * Shows a blueprint inside the page. The file needs the session token, so
 * it is downloaded first and shown from a temporary browser URL.
 */
export function BlueprintViewer({ projectId, blueprint }) {
  const file = useApiData(
    (signal) => getBlueprintFile(projectId, blueprint.id, { signal }).then((blob) => URL.createObjectURL(blob)),
    [projectId, blueprint.id],
  )
  const url = file.data

  useEffect(() => {
    // Frees the memory of the file when the page closes or another file is shown.
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])

  if (file.status === 'error') return <ErrorState error={file.error} onRetry={file.retry} />
  if (!url) return <LoadingState title="Loading the blueprint…" message={null} />

  return (
    <section className="card blueprint-viewer">
      {isImage(blueprint) ? (
        <img src={url} alt={`Blueprint ${blueprint.originalFilename}`} />
      ) : (
        <iframe src={url} title={`Blueprint ${blueprint.originalFilename}`} />
      )}
      <div className="button-row">
        <a href={url} download={blueprint.originalFilename} className="button-link button-secondary">
          Download
        </a>
        <a href={url} target="_blank" rel="noreferrer">
          Open in a new tab
        </a>
      </div>
    </section>
  )
}
