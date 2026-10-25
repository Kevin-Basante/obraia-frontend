import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { FormField } from '../../components/FormField.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PhaseTimeline } from '../../components/catalog/PhaseTimeline.jsx'
import { SizePicker } from '../../components/catalog/SizePicker.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js'
import { getPhasePlan, getProjectType } from '../../services/catalogService.js'
import './ProjectTypeDetailPage.css'

/** Reads the area field: a positive number, or null when it is empty or invalid. */
function parseArea(text) {
  const area = Number(text.replace(',', '.'))
  return text.trim() && area > 0 ? area : null
}

/** One project type and its standard phases by size. */
export function ProjectTypeDetailPage() {
  const { id } = useParams()
  const [size, setSize] = useState('small')
  const [areaText, setAreaText] = useState('')
  const area = useDebouncedValue(parseArea(areaText))
  const areaError = areaText.trim() && parseArea(areaText) === null ? 'Enter an area greater than 0' : undefined

  const type = useApiData((signal) => getProjectType(id, { signal }), [id])
  const plan = useApiData((signal) => getPhasePlan(id, { size, area }, { signal }), [id, size, area])

  if (type.status === 'error') return <ErrorState error={type.error} onRetry={type.retry} />
  if (!type.data) return <LoadingState title="Loading project type…" />

  return (
    <div className="project-type">
      <Link to="/catalog/project-types">← All project types</Link>
      <section className="card">
        <h2>{type.data.name}</h2>
        <p className="muted">{type.data.description}</p>
      </section>

      <section className="card" aria-labelledby="phases-title">
        <h2 id="phases-title">Standard phases</h2>
        <div className="project-type__controls">
          <SizePicker value={size} onChange={setSize} disabled={area !== null} />
          <FormField
            label="Or type the built area (m²)"
            inputMode="decimal"
            placeholder="95"
            value={areaText}
            onChange={(e) => setAreaText(e.target.value)}
            error={areaError}
            hint="The area decides the size."
          />
        </div>
        {plan.status === 'error' && <ErrorState error={plan.error} onRetry={plan.retry} />}
        {plan.status === 'loading' && !plan.data && <LoadingState title="Loading phases…" message="" />}
        {plan.data && plan.status !== 'error' && (
          <>
            {area !== null && (
              <p className="project-type__note">
                {area} m² is a <strong>{plan.data.sizeCategory}</strong> project.
              </p>
            )}
            <PhaseTimeline plan={plan.data} updating={plan.status === 'loading'} />
          </>
        )}
      </section>
    </div>
  )
}
