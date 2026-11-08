import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ErrorState } from '../../components/ErrorState.jsx'
import { FormAlert } from '../../components/FormAlert.jsx'
import { LoadingState } from '../../components/LoadingState.jsx'
import { PageHeader } from '../../components/PageHeader.jsx'
import { SelectField } from '../../components/SelectField.jsx'
import { MeasurementForm } from '../../components/measurements/MeasurementForm.jsx'
import { MeasurementTable } from '../../components/measurements/MeasurementTable.jsx'
import { useApiData } from '../../hooks/useApiData.js'
import { useFormSubmit } from '../../hooks/useFormSubmit.js'
import { listBlueprints } from '../../services/blueprintService.js'
import { getElementTypes } from '../../services/catalogService.js'
import {
  createMeasurement,
  deleteMeasurement,
  listMeasurements,
  updateMeasurement,
} from '../../services/measurementService.js'
import { getProject } from '../../services/projectService.js'
import { EMPTY_MEASUREMENT_FORM, toMeasurementForm } from '../../utils/measurementForm.js'
import { isClosed } from '../../utils/projectStatus.js'
import { NotFoundPage } from '../NotFoundPage.jsx'
import { codeText, t } from '../../i18n/i18n.js'

/** Manual measurements of a project: add, edit, delete and filter them by floor. */
export function MeasurementsPage() {
  const { id } = useParams()
  const [floor, setFloor] = useState('')
  // The measurement being edited, or null to add a new one.
  const [editing, setEditing] = useState(null)
  // Changes after each save, so the form starts empty again.
  const [formKey, setFormKey] = useState(0)

  const project = useApiData((signal) => getProject(id, { signal }), [id])
  const elementTypes = useApiData((signal) => getElementTypes({ signal }), [])
  const blueprints = useApiData((signal) => listBlueprints(id, { signal }), [id])
  const measurements = useApiData((signal) => listMeasurements(id, { floor }, { signal }), [id, floor])
  const { retry } = measurements

  const save = useCallback(
    async (request) => {
      const saved = editing ? await updateMeasurement(id, editing.id, request) : await createMeasurement(id, request)
      setEditing(null)
      setFormKey((key) => key + 1)
      retry()
      return saved
    },
    [id, editing, retry],
  )
  const remove = useCallback((measurementId) => deleteMeasurement(id, measurementId).then(retry), [id, retry])
  const removing = useFormSubmit(remove)

  if (project.error?.status === 404) return <NotFoundPage />
  const failed = [project, elementTypes, blueprints, measurements].find((request) => request.status === 'error')
  if (failed) return <ErrorState error={failed.error} onRetry={failed.retry} />
  if (!project.data || !elementTypes.data || !blueprints.data || !measurements.data) {
    return <LoadingState title={t('measurementsPage.loadingTheMeasurements')} />
  }

  const closed = isClosed(project.data)
  const floors = project.data.floors
  const floorOptions = Array.from({ length: floors }, (_, index) => ({
    value: String(index + 1),
    label: t('measurementForm.floorNumber', { number: index + 1 }),
  }))

  function handleEdit(measurement) {
    setEditing(measurement)
    setFormKey((key) => key + 1)
  }

  function handleCancel() {
    setEditing(null)
    setFormKey((key) => key + 1)
  }

  function handleDelete(measurement) {
    if (
      window.confirm(
        t('measurementsPage.confirmDelete', {
          element: codeText('element', measurement.elementType, measurement.elementLabel).toLowerCase(),
        }),
      )
    ) {
      if (editing?.id === measurement.id) handleCancel()
      removing.submit(measurement.id)
    }
  }

  return (
    <div className="workspace">
      <PageHeader
        title={t('measurementsPage.measurements')}
        description={`${project.data.name} · ${t('measurementsPage.floors', { count: floors })}`}
        back={{ to: `/projects/${id}`, label: project.data.name }}
        actions={
          <Link to={`/projects/${id}/measurements/comparison`} className="button-link button-secondary">
            {t('measurementsPage.compareWithAi')}
          </Link>
        }
      />
      <div className="workspace__split">
        {!closed && (
          <section className="card">
            <h2>
              {editing
                ? t('measurementsPage.editTitle', {
                    element: codeText('element', editing.elementType, editing.elementLabel).toLowerCase(),
                  })
                : t('measurementsPage.addAMeasurement')}
            </h2>
            <p className="muted">{t('measurementsPage.units')}</p>
            <MeasurementForm
              key={formKey}
              initialForm={editing ? toMeasurementForm(editing) : EMPTY_MEASUREMENT_FORM}
              elementTypes={elementTypes.data}
              blueprints={blueprints.data}
              floors={floors}
              onSave={save}
              onCancel={editing ? handleCancel : undefined}
              submitText={editing ? t('measurementsPage.saveChanges') : t('measurementsPage.addMeasurement')}
            />
          </section>
        )}
        <section className="card">
          <div className="button-row measurements-header">
            <h2>{t('measurementsPage.measuredElements')}</h2>
            {floors > 1 && (
              <SelectField
                label={t('measurementsPage.floor')}
                placeholder={t('measurementsPage.allFloors')}
                options={floorOptions}
                value={floor}
                onChange={(event) => setFloor(event.target.value)}
              />
            )}
          </div>
          {closed && <p className="muted">{t('measurementsPage.theProjectIsClosedThe')}</p>}
          {measurements.data.length === 0 ? (
            <p className="muted">
              {floor ? t('measurementsPage.thereAreNoMeasurementsOn') : t('measurementsPage.thereAreNoMeasurementsYet')}
            </p>
          ) : (
            <MeasurementTable
              measurements={measurements.data}
              onEdit={closed ? undefined : handleEdit}
              onDelete={closed ? undefined : handleDelete}
              busy={removing.pending}
            />
          )}
          <FormAlert>{removing.error?.message}</FormAlert>
        </section>
      </div>
    </div>
  )
}
