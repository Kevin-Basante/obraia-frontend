import { useCallback } from 'react'
import { Link, useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { MembersPanel } from '../../components/projects/MembersPanel.jsx'
import { ProjectSummary } from '../../components/projects/ProjectSummary.jsx'
import { ProjectWorkLinks } from '../../components/projects/ProjectWorkLinks.jsx'
import { SiteManagerPanel } from '../../components/projects/SiteManagerPanel.jsx'
import { StatusActions } from '../../components/projects/StatusActions.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useAuth } from '../../hooks/useAuth.js'
import { getProject } from '../../services/projectService.js'
import { isClosed } from '../../utils/projectStatus.js'
import { NotFoundPage } from '../NotFoundPage.jsx'

/** One project: its data, status, blueprints and measurements, site manager and members. */
export function ProjectDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const project = useApiData((signal) => getProject(id, { signal }), [id])
  const { retry } = project
  // After a change, the page reads the project again so every panel shows the new state.
  const reload = useCallback(() => retry(), [retry])

  if (project.error?.status === 404) return <NotFoundPage />
  if (project.status === 'error') return <ErrorState error={project.error} onRetry={retry} />
  if (!project.data) return <LoadingState title="Loading the project…" />

  const data = project.data
  const closed = isClosed(data)

  return (
    <div className="workspace">
      <PageHeader
        title={data.name}
        back={{ to: '/projects', label: 'My projects' }}
        actions={
          <>
            {!closed && (
              <Link to={`/projects/${data.id}/edit`} className="button-link">
                Edit
              </Link>
            )}
            <Link to={`/projects/${data.id}/delete`} className="button-link button-secondary">
              Delete
            </Link>
          </>
        }
      />
      <StatusActions project={data} onChanged={reload} />
      <ProjectSummary project={data} />
      <ProjectWorkLinks projectId={data.id} />
      <SiteManagerPanel project={data} readOnly={closed} onChanged={reload} />
      <MembersPanel projectId={data.id} currentUserId={user?.id} />
    </div>
  )
}
