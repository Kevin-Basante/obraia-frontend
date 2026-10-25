import { useNavigate } from 'react-router'
import { PageHeader } from '../../components/PageHeader.jsx'
import { ProjectForm } from '../../components/projects/ProjectForm.jsx'
import { createProject } from '../../services/projectService.js'
import { EMPTY_PROJECT_FORM } from '../../utils/projectForm.js'

/** Creates a project in draft status and opens its page. */
export function NewProjectPage() {
  const navigate = useNavigate()

  async function save(request) {
    const project = await createProject(request)
    navigate(`/projects/${project.id}`, { replace: true })
    return project
  }

  return (
    <div className="workspace">
      <PageHeader
        title="New project"
        description="It starts as a draft. You can change every value later."
        back={{ to: '/projects', label: 'My projects' }}
      />
      <ProjectForm initialForm={EMPTY_PROJECT_FORM} onSave={save} submitText="Create project" pendingText="Creating…" />
    </div>
  )
}
