import { codeText } from '../i18n/i18n.js'
// How a row of the comparison is shown. The backend decides the status:
// a difference up to the tolerance (10 %) is a match.

export function comparisonLabel(status) {
  return codeText('comparison', status)
}

/** 5 -> "+5%", -20 -> "-20%". Null when one of the two totals is missing. */
export function formatDifference(differencePct) {
  if (differencePct === null || differencePct === undefined) return '—'
  const value = Number(differencePct)
  const text = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 }).format(Math.abs(value))
  if (value === 0) return '0%'
  return `${value > 0 ? '+' : '-'}${text}%`
}
