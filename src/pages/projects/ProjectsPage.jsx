import { useState } from 'react'
import { Link } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { FormField } from '../../components/FormField.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { SelectField } from '../../components/SelectField.jsx'
import { EmptyState } from '../../components/catalog/EmptyState.jsx'
import { FilterBar } from '../../components/catalog/FilterBar.jsx'
import { ResultCount } from '../../components/catalog/ResultCount.jsx'
import { ProjectList } from '../../components/projects/ProjectList.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js'
import { listProjects } from '../../services/projectService.js'
import { projectStatusOptions } from '../../utils/projectStatus.js'
import { t } from '../../i18n/i18n.js'

/** Projects of the user, newest first, with filters by status and by name or city. */
export function ProjectsPage() {
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search)
  const projects = useApiData(
    (signal) => listProjects({ status, search: debouncedSearch }, { signal }),
    [status, debouncedSearch],
  )
  const filtered = Boolean(status || debouncedSearch.trim())

  return (
    <div className="workspace">
      <PageHeader
        title={t('projectsPage.myProjects')}
        description={t('projectsPage.projectsYouCreatedOrThat')}
        actions={
          <Link to="/projects/new" className="button-link">
            {t('projectsPage.newProject')}
          </Link>
        }
      />
      <FilterBar>
        <FormField
          label={t('projectsPage.search')}
          type="search"
          placeholder={t('projectsPage.nameOrCity')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SelectField
          label={t('projectsPage.status')}
          placeholder={t('projectsPage.allStatuses')}
          options={projectStatusOptions()}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </FilterBar>

      {projects.status === 'error' && <ErrorState error={projects.error} onRetry={projects.retry} />}
      {projects.status === 'loading' && !projects.data && (
        <LoadingState title={t('projectsPage.loadingYourProjects')} />
      )}
      {projects.data && projects.status !== 'error' && (
        <>
          <ResultCount count={projects.data.length} noun="project" updating={projects.status === 'loading'} />
          {projects.data.length === 0 ? (
            <EmptyState>
              {filtered ? t('projectsPage.noProjectsMatchTheseFilters') : t('projectsPage.youHaveNoProjectsYet')}
            </EmptyState>
          ) : (
            <ProjectList projects={projects.data} updating={projects.status === 'loading'} />
          )}
        </>
      )}
    </div>
  )
}
