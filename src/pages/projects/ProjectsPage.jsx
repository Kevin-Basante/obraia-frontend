import { useState } from 'react'
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
import { PROJECT_STATUSES } from '../../utils/projectStatus.js'

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
        title="My projects"
        description="Projects you created or that others shared with you."
      />
      <FilterBar>
        <FormField
          label="Search"
          type="search"
          placeholder="Name or city…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <SelectField
          label="Status"
          placeholder="All statuses"
          options={PROJECT_STATUSES}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </FilterBar>

      {projects.status === 'error' && <ErrorState error={projects.error} onRetry={projects.retry} />}
      {projects.status === 'loading' && !projects.data && <LoadingState title="Loading your projects…" />}
      {projects.data && projects.status !== 'error' && (
        <>
          <ResultCount
            count={projects.data.length}
            singular="project"
            plural="projects"
            updating={projects.status === 'loading'}
          />
          {projects.data.length === 0 ? (
            <EmptyState>
              {filtered ? 'No projects match these filters.' : 'You have no projects yet. Create the first one.'}
            </EmptyState>
          ) : (
            <ProjectList projects={projects.data} updating={projects.status === 'loading'} />
          )}
        </>
      )}
    </div>
  )
}
