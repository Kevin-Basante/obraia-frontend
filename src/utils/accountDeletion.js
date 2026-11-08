import { t } from '../i18n/i18n.js'
// Texts of the warnings shown before deleting the account.

/** "A", "A and B", "A, B and C", each name between quotes. */
export function joinNames(names) {
  const quoted = names.map((name) => `“${name}”`)
  if (quoted.length <= 1) return quoted.join('')
  return t('accountDeletion.and', { first: quoted.slice(0, -1).join(', '), last: quoted.at(-1) })
}

/** Sentence about the projects of other people the user leaves, or null when there are none. */
export function joinedProjectsText(count) {
  if (count === 0) return null
  return t('accountDeletion.joined', { count })
}
