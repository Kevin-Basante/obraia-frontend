import { formatDate } from '../../utils/format.js'
import './DeletionImpact.css'

// Names of the modules counted by the backend. Members are not deleted, so they are listed apart.
const LABELS = {
  blueprints: ['blueprint', 'blueprints'],
  phases: ['phase', 'phases'],
  budgets: ['budget', 'budgets'],
  expenses: ['expense', 'expenses'],
}

/** Warnings shown before deleting (red border): what the project holds and when it disappears for good. */
export function DeletionImpact({ impact }) {
  const { members = 1, ...content } = impact.content
  const others = members - 1
  const items = Object.entries(content)
    .filter(([, count]) => count > 0)
    .map(([key, count]) => {
      const [singular, plural] = LABELS[key] ?? [key, key]
      return `${count} ${count === 1 ? singular : plural}`
    })

  return (
    <section className="card deletion-impact" role="alert">
      <h2>Before you delete “{impact.projectName}”</h2>
      <ul>
        <li>
          {items.length > 0
            ? `It will delete everything the project holds: ${items.join(', ')}.`
            : 'The project has no blueprints, phases, budgets or expenses yet.'}
        </li>
        {others > 0 && <li>{others === 1 ? 'The other member' : `The other ${others} members`} will lose access too.</li>}
        <li>
          We will email you a link that works for {impact.linkValidMinutes} minutes. Nothing is deleted until you open
          it.
        </li>
        <li>
          After you confirm, the project disappears from your list, and its data is removed for good on{' '}
          {formatDate(impact.purgeDate)}.
        </li>
      </ul>
    </section>
  )
}
