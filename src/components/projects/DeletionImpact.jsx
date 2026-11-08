import { formatDate } from '../../utils/format.js'
import './DeletionImpact.css'
import { t } from '../../i18n/i18n.js'

// Modules counted by the backend. Members are not deleted, so they are listed apart.
const MODULES = ['blueprints', 'phases', 'budgets', 'expenses']

/** Warnings shown before deleting (red border): what the project holds and when it disappears for good. */
export function DeletionImpact({ impact }) {
  const { members = 1, ...content } = impact.content
  const others = members - 1
  const items = Object.entries(content)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => (MODULES.includes(key) ? t(`deletionImpact.items.${key}`, { count }) : `${count} ${key}`))

  return (
    <section className="card deletion-impact" role="alert">
      <h2>{t('deletionImpact.title', { name: impact.projectName })}</h2>
      <ul>
        <li>
          {items.length > 0
            ? t('deletionImpact.holds', { items: items.join(', ') })
            : t('deletionImpact.theProjectHasNoBlueprints')}
        </li>
        {others > 0 && <li>{t('deletionImpact.others', { count: others })}</li>}
        <li>{t('deletionImpact.link', { minutes: impact.linkValidMinutes })}</li>
        <li>{t('deletionImpact.purge', { date: formatDate(impact.purgeDate) })}</li>
      </ul>
    </section>
  )
}
