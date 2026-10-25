/**
 * Turns filters into a query string, skipping empty values:
 * { category: 'steel', search: '' } -> '?category=steel'
 */
export function buildQuery(params = {}) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue
    const text = String(value).trim()
    if (text) query.set(key, text)
  }
  const result = query.toString()
  return result ? `?${result}` : ''
}
