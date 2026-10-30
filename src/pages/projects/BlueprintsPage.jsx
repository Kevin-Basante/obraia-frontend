import { useCallback } from 'react'
import { useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { BlueprintList } from '../../components/blueprints/BlueprintList.jsx'
import { BlueprintUploadForm } from '../../components/blueprints/BlueprintUploadForm.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { listBlueprints, uploadBlueprint } from '../../services/blueprintService.js'
import { getProject } from '../../services/projectService.js'
import { MAX_BLUEPRINTS } from '../../utils/blueprintFile.js'
import { isClosed } from '../../utils/projectStatus.js'
import { NotFoundPage } from '../NotFoundPage.jsx'

/** Blueprints of a project: upload photos or PDFs and open them. */
export function BlueprintsPage() {
  const { id } = useParams()
  const project = useApiData((signal) => getProject(id, { signal }), [id])
  const blueprints = useApiData((signal) => listBlueprints(id, { signal }), [id])
  const { retry } = blueprints

  const upload = useCallback(
    async (file) => {
      const blueprint = await uploadBlueprint(id, file)
      retry()
      return blueprint
    },
    [id, retry],
  )

  if (project.error?.status === 404) return <NotFoundPage />
  const error = project.error ?? blueprints.error
  if (error) {
    return <ErrorState error={error} onRetry={project.error ? project.retry : retry} />
  }
  if (!project.data || !blueprints.data) return <LoadingState title="Loading the blueprints…" />

  const closed = isClosed(project.data)
  const full = blueprints.data.length >= MAX_BLUEPRINTS

  return (
    <div className="workspace">
      <PageHeader
        title="Blueprints"
        description={`${project.data.name} · ${blueprints.data.length} of ${MAX_BLUEPRINTS} blueprints`}
        back={{ to: `/projects/${id}`, label: project.data.name }}
      />
      {!closed && (
        <section className="card">
          <h2>Upload a blueprint</h2>
          {full ? (
            <p className="muted">This project already has {MAX_BLUEPRINTS} blueprints. Delete one to upload another.</p>
          ) : (
            <>
              <p className="muted">A photo or a PDF of the plans. The AI will read the measurements in a later step.</p>
              <BlueprintUploadForm onUpload={upload} />
            </>
          )}
        </section>
      )}
      <section className="card">
        <h2>Uploaded blueprints</h2>
        {closed && <p className="muted">The project is closed: the blueprints can be opened but not changed.</p>}
        {blueprints.data.length === 0 ? (
          <p className="muted">There are no blueprints yet.</p>
        ) : (
          <BlueprintList projectId={id} blueprints={blueprints.data} />
        )}
      </section>
    </div>
  )
}
