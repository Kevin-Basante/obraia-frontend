import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { FormField } from '../../components/FormField.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { SelectField } from '../../components/SelectField.jsx'
import { FormulaTable } from '../../components/catalog/FormulaTable.jsx'
import { PhaseTimeline } from '../../components/catalog/PhaseTimeline.jsx'
import { SizePicker } from '../../components/catalog/SizePicker.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js'
import { getMaterialFormulas, getPhasePlan, getProjectType } from '../../services/catalogService.js'
import './ProjectTypeDetailPage.css'
import { codeText, t } from '../../i18n/i18n.js'

/** Reads the area field: a positive number, or null when it is empty or invalid. */
function parseArea(text) {
  const area = Number(text.replace(',', '.'))
  return text.trim() && area > 0 ? area : null
}

/** One project type: its standard phases by size and the materials per building element. */
/** "96 m² is a small project.", with the size in bold. */
function sizeNote(area, size) {
  const [before, after] = t('projectTypeDetailPage.sizeNote', { area }).split('{size}')
  return (
    <>
      {before}
      <strong>{codeText('size', size)}</strong>
      {after}
    </>
  )
}

export function ProjectTypeDetailPage() {
  const { id } = useParams()
  const [size, setSize] = useState('small')
  const [areaText, setAreaText] = useState('')
  const [element, setElement] = useState('')
  const area = useDebouncedValue(parseArea(areaText))
  const areaError =
    areaText.trim() && parseArea(areaText) === null ? t('projectTypeDetailPage.enterAnAreaGreaterThan') : undefined

  const type = useApiData((signal) => getProjectType(id, { signal }), [id])
  const plan = useApiData((signal) => getPhasePlan(id, { size, area }, { signal }), [id, size, area])
  const formulas = useApiData((signal) => getMaterialFormulas(id, {}, { signal }), [id])

  if (type.status === 'error') return <ErrorState error={type.error} onRetry={type.retry} />
  if (!type.data) return <LoadingState title={t('projectTypeDetailPage.loadingProjectType')} />

  const elementOptions = [
    ...new Map((formulas.data ?? []).map((f) => [f.elementType, codeText('element', f.elementType, f.elementLabel)])),
  ].map(([value, label]) => ({ value, label }))
  const shownFormulas = (formulas.data ?? []).filter((f) => !element || f.elementType === element)

  return (
    <div className="project-type">
      <Link to="/catalog/project-types">{t('projectTypeDetailPage.allProjectTypes')}</Link>
      <section className="card">
        <h2>{type.data.name}</h2>
        <p className="muted">{type.data.description}</p>
      </section>

      <section className="card" aria-labelledby="phases-title">
        <h2 id="phases-title">{t('projectTypeDetailPage.standardPhases')}</h2>
        <div className="project-type__controls">
          <SizePicker value={size} onChange={setSize} disabled={area !== null} />
          <FormField
            label={t('projectTypeDetailPage.orTypeTheBuiltArea')}
            inputMode="decimal"
            placeholder="95"
            value={areaText}
            onChange={(e) => setAreaText(e.target.value)}
            error={areaError}
            hint={t('projectTypeDetailPage.theAreaDecidesTheSize')}
          />
        </div>
        {plan.status === 'error' && <ErrorState error={plan.error} onRetry={plan.retry} />}
        {plan.status === 'loading' && !plan.data && (
          <LoadingState title={t('projectTypeDetailPage.loadingPhases')} message="" />
        )}
        {plan.data && plan.status !== 'error' && (
          <>
            {area !== null && <p className="project-type__note">{sizeNote(area, plan.data.sizeCategory)}</p>}
            <PhaseTimeline plan={plan.data} updating={plan.status === 'loading'} />
          </>
        )}
      </section>

      <section className="card" aria-labelledby="materials-title">
        <h2 id="materials-title">{t('projectTypeDetailPage.materialsPerBuildingElement')}</h2>
        <p className="muted">{t('projectTypeDetailPage.howMuchOfEachMaterial')}</p>
        {formulas.status === 'error' && <ErrorState error={formulas.error} onRetry={formulas.retry} />}
        {!formulas.data && formulas.status === 'loading' && (
          <LoadingState title={t('projectTypeDetailPage.loadingMaterials')} message="" />
        )}
        {formulas.data && (
          <>
            <SelectField
              label={t('projectTypeDetailPage.buildingElement')}
              placeholder={t('projectTypeDetailPage.allElements')}
              options={elementOptions}
              value={element}
              onChange={(e) => setElement(e.target.value)}
            />
            <FormulaTable formulas={shownFormulas} />
          </>
        )}
      </section>
    </div>
  )
}
