import { dateLocale, t } from '../i18n/i18n.js'
/** "Good morning" until noon, "Good afternoon" until 6 PM and "Good evening" after that. */
export function greetingFor(date = new Date()) {
  const hour = date.getHours()
  if (hour < 12) return t('greeting.goodMorning')
  if (hour < 18) return t('greeting.goodAfternoon')
  return t('greeting.goodEvening')
}

/** "Wednesday, November 4" (or "miércoles, 4 de noviembre") for the top of the dashboard. */
export function longDate(date = new Date()) {
  return date.toLocaleDateString(dateLocale(), { weekday: 'long', month: 'long', day: 'numeric' })
}
