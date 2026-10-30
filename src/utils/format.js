// Prices come from Colombia, so money and numbers use the Colombian format.
const currency = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
const decimal = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 4 })
const percent = new Intl.NumberFormat('es-CO', { style: 'percent', maximumFractionDigits: 1 })

/** 33000 -> "$ 33.000" */
export function formatCurrency(value) {
  return currency.format(Number(value))
}

/** 12.5 -> "12,5" */
export function formatQuantity(value) {
  return decimal.format(Number(value))
}

/** 0.05 -> "5%" */
export function formatPercent(value) {
  return percent.format(Number(value))
}

/** "2026-10-04" -> "Oct 4, 2026". The date has no time, so it is read as local. */
export function formatDate(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

/** "2026-10-30T04:47:34Z" -> "Oct 30, 2026, 11:47 PM", in the time zone of the browser. */
export function formatDateTime(isoInstant) {
  return new Date(isoInstant).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** 49441 -> "48,3 KB" */
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${decimal.format(Math.round((bytes / 1024) * 10) / 10)} KB`
  return `${decimal.format(Math.round((bytes / (1024 * 1024)) * 10) / 10)} MB`
}

/** 33.6 and "m2" -> "33,6 m²" */
export function formatAmount(value, unit) {
  return `${formatQuantity(value)} ${unit === 'm3' ? 'm³' : 'm²'}`
}
