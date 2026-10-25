import { useCallback } from 'react'
import { useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { ProjectSummary } from '../../components/projects/ProjectSummary.jsx'
import { StatusActions } from '../../components/projects/StatusActions.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { getProject } from '../../services/projectService.js'
import { NotFoundPage } from '../NotFoundPage.jsx'

/** One project: its data and status. */
export function ProjectDetailPage() {
  const { id } = useParams()
  const project = useApiData((signal) => getProject(id, { signal }), [id])
  const { retry } = project
  // After a change, the page reads the project again so every panel shows the new state.
  const reload = useCallback(() => retry(), [retry])

  if (project.error?.status === 404) return <NotFoundPage />
  if (project.status === 'error') return <ErrorState error={project.error} onRetry={retry} />
  if (!project.data) return <LoadingState title="Loading the project…" />

  const data = project.data

  return (
    <div className="workspace">
      <PageHeader title={data.name} back={{ to: '/projects', label: 'My projects' }} />
      <StatusActions project={data} onChanged={reload} />
      <ProjectSummary project={data} />
    </div>
  )
}
