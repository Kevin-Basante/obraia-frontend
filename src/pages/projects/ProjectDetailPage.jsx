import { useCallback } from 'react'
import { Link, useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { FormAlert } from '../../components/FormAlert.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { MoneyPanel } from '../../components/dashboard/MoneyPanel.jsx'
import { PhaseProgressList } from '../../components/dashboard/PhaseProgressList.jsx'
import { ProjectKpis } from '../../components/dashboard/ProjectKpis.jsx'
import { UpcomingTasks } from '../../components/dashboard/UpcomingTasks.jsx'
import { MembersPanel } from '../../components/projects/MembersPanel.jsx'
import { ProjectSummary } from '../../components/projects/ProjectSummary.jsx'
import { ProjectWorkLinks } from '../../components/projects/ProjectWorkLinks.jsx'
import { SiteManagerPanel } from '../../components/projects/SiteManagerPanel.jsx'
import { StatusActions } from '../../components/projects/StatusActions.jsx'
import { RiskPanel } from '../../components/risk/RiskPanel.jsx'
import { useAiWakeUp } from '../../hooks/useAiWakeUp.js'
import { useApiData } from '../../hooks/useApiData.js'
import { useAuth } from '../../hooks/useAuth.js'
import { getProjectOverview } from '../../services/dashboardService.js'
import { getProject } from '../../services/projectService.js'
import { isClosed } from '../../utils/projectStatus.js'
import { NotFoundPage } from '../NotFoundPage.jsx'
import './ProjectDetailPage.css'
import { t } from '../../i18n/i18n.js'

/**
 * Dashboard of one project: status and data on top, the key numbers, the
 * links to its work, the phases and next tasks, the money, the risk and the
 * people, all on one screen.
 */
export function ProjectDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  // The PDF reports ask the AI for a summary, so it starts waking up now.
  useAiWakeUp()
  const project = useApiData((signal) => getProject(id, { signal }), [id])
  const overview = useApiData((signal) => getProjectOverview(id, { signal }), [id])
  const { retry: retryProject } = project
  const { retry: retryOverview } = overview
  // After a change, the page reads everything again so every panel shows the new state.
  const reload = useCallback(() => {
    retryProject()
    retryOverview()
  }, [retryProject, retryOverview])

  if (project.error?.status === 404) return <NotFoundPage />
  if (project.status === 'error') return <ErrorState error={project.error} onRetry={retryProject} />
  if (!project.data) return <LoadingState title={t('projectDetailPage.loadingTheProject')} />

  const data = project.data
  const closed = isClosed(data)
  const summary = overview.data

  return (
    <div className="workspace project-dashboard">
      <PageHeader
        title={data.name}
        description={`${data.projectType.name} · ${data.location.city}`}
        back={{ to: '/projects', label: t('projectDetailPage.myProjects') }}
        actions={
          <>
            {!closed && (
              <Link to={`/projects/${data.id}/edit`} className="button-link">
                {t('projectDetailPage.edit')}
              </Link>
            )}
            <Link to={`/projects/${data.id}/delete`} className="button-link button-secondary">
              {t('projectDetailPage.delete')}
            </Link>
          </>
        }
      />
      <div className="project-dashboard__grid">
        <div className="project-dashboard__status">
          <StatusActions project={data} onChanged={reload} />
        </div>
        <div className="project-dashboard__details">
          <ProjectSummary project={data} />
        </div>
        <div className="project-dashboard__full">
          {overview.status === 'error' && (
            <FormAlert>
              {t('projectDetailPage.weCouldNotLoadThe')} {overview.error.message}
            </FormAlert>
          )}
          {!summary && overview.status === 'loading' && (
            <p className="muted">{t('projectDetailPage.loadingTheSummary')}</p>
          )}
          {summary && <ProjectKpis overview={summary} />}
        </div>
        <div className="project-dashboard__full">
          <ProjectWorkLinks projectId={data.id} />
        </div>
        {summary && (
          <>
            <div className="project-dashboard__wide">
              <PhaseProgressList projectId={data.id} phases={summary.work.phases} />
            </div>
            <div className="project-dashboard__narrow">
              <UpcomingTasks projectId={data.id} tasks={summary.work.upcomingTasks} />
            </div>
            <div className="project-dashboard__half">
              <MoneyPanel projectId={data.id} money={summary.money} />
            </div>
          </>
        )}
        <div className={summary ? 'project-dashboard__half' : 'project-dashboard__full'}>
          <RiskPanel projectId={data.id} onAssessed={retryOverview} />
        </div>
        <div className="project-dashboard__half">
          <SiteManagerPanel project={data} readOnly={closed} onChanged={reload} />
        </div>
        <div className="project-dashboard__half">
          <MembersPanel projectId={data.id} currentUserId={user?.id} />
        </div>
      </div>
    </div>
  )
}
