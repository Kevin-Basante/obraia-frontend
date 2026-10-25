import { Link } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { getProjectTypes } from '../../services/catalogService.js'
import './ProjectTypesPage.css'

/** Kinds of construction ObraIA can plan. Each one links to its phases and materials. */
export function ProjectTypesPage() {
  const types = useApiData((signal) => getProjectTypes({ signal }), [])

  if (types.status === 'error') return <ErrorState error={types.error} onRetry={types.retry} />
  if (!types.data) return <LoadingState title="Loading project types…" />

  return (
    <ul className="project-types">
      {types.data.map((type) => (
        <li key={type.id} className="card project-types__item">
          <h2>{type.name}</h2>
          <p className="muted">{type.description}</p>
          <Link to={`/catalog/project-types/${type.id}`} className="button-link">
            See phases and materials
          </Link>
        </li>
      ))}
    </ul>
  )
}
