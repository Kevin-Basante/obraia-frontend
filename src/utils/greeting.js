/** "Good morning" until noon, "Good afternoon" until 6 PM and "Good evening" after that. */
export function greetingFor(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 18) return 'Good afternoon'
  return 'Good evening'
}

/** "Wednesday, November 4" for the top of the dashboard. */
export function longDate(date = new Date()) {
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}
