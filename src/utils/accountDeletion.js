// Texts of the warnings shown before deleting the account.

/** "A", "A and B", "A, B and C", each name between quotes. */
export function joinNames(names) {
  const quoted = names.map((name) => `“${name}”`)
  if (quoted.length <= 1) return quoted.join('')
  return `${quoted.slice(0, -1).join(', ')} and ${quoted.at(-1)}`
}

/** Sentence about the projects of other people the user leaves, or null when there are none. */
export function joinedProjectsText(count) {
  if (count === 0) return null
  if (count === 1) return 'You leave 1 project created by another person. It stays for its owner.'
  return `You leave ${count} projects created by other people. They stay for their owners.`
}
