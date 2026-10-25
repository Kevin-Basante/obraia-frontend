import { useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { ProjectSummary } from '../../components/projects/ProjectSummary.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { getProject } from '../../services/projectService.js'
import { NotFoundPage } from '../NotFoundPage.jsx'

/** One project and its data. */
export function ProjectDetailPage() {
  const { id } = useParams()
  const project = useApiData((signal) => getProject(id, { signal }), [id])
  const { retry } = project

  if (project.error?.status === 404) return <NotFoundPage />
  if (project.status === 'error') return <ErrorState error={project.error} onRetry={retry} />
  if (!project.data) return <LoadingState title="Loading the project…" />

  const data = project.data

  return (
    <div className="workspace">
      <PageHeader title={data.name} back={{ to: '/projects', label: 'My projects' }} />
      <ProjectSummary project={data} />
    </div>
  )
}
