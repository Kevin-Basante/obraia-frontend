import { formatDate, formatQuantity } from '../../utils/format.js'
import './ProjectSummary.css'
import { t } from '../../i18n/i18n.js'

function dateOrDash(date) {
  return date ? formatDate(date) : '—'
}

/** Main data of a project as a list of label and value. */
export function ProjectSummary({ project }) {
  const rows = [
    [t('projectSummary.projectType'), project.projectType.name],
    [t('projectSummary.city'), `${project.location.city}, ${project.location.department}`],
    [t('projectSummary.address'), project.address ?? '—'],
    [
      t('projectSummary.builtArea'),
      t('projectSummary.area', {
        area: formatQuantity(project.builtAreaM2),
        size: t(`projectSummary.${project.sizeCategory === 'small' ? 'small' : 'large'}`),
      }),
    ],
    [t('projectSummary.floors'), project.floors],
    [
      t('projectSummary.plannedDates'),
      t('projectSummary.range', {
        start: dateOrDash(project.plannedStartDate),
        end: dateOrDash(project.plannedEndDate),
      }),
    ],
    [
      t('projectSummary.actualDates'),
      t('projectSummary.range', { start: dateOrDash(project.actualStartDate), end: dateOrDash(project.actualEndDate) }),
    ],
  ]

  return (
    <section className="card">
      <h2>{t('projectSummary.details')}</h2>
      <dl className="project-summary">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
