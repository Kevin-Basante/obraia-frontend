import { useNavigate, useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { FormAlert } from '../../components/FormAlert.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { ProjectForm } from '../../components/projects/ProjectForm.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { getProject, updateProject } from '../../services/projectService.js'
import { toProjectForm } from '../../utils/projectForm.js'
import { isClosed } from '../../utils/projectStatus.js'
import { NotFoundPage } from '../NotFoundPage.jsx'

/** Edits the data of a project that is not completed or cancelled. */
export function EditProjectPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const project = useApiData((signal) => getProject(id, { signal }), [id])

  async function save(request) {
    const saved = await updateProject(id, request)
    navigate(`/projects/${id}`)
    return saved
  }

  if (project.error?.status === 404) return <NotFoundPage />
  if (project.status === 'error') return <ErrorState error={project.error} onRetry={project.retry} />
  if (!project.data) return <LoadingState title="Loading the project…" />

  const back = { to: `/projects/${id}`, label: project.data.name }

  return (
    <div className="workspace">
      <PageHeader title="Edit project" back={back} />
      {isClosed(project.data) ? (
        <FormAlert>A {project.data.status.label.toLowerCase()} project can no longer be edited.</FormAlert>
      ) : (
        <ProjectForm
          initialForm={toProjectForm(project.data)}
          onSave={save}
          submitText="Save changes"
          pendingText="Saving…"
        />
      )}
    </div>
  )
}
