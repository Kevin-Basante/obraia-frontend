import { renderToStaticMarkup } from 'react-dom/server'

// The tests run in Node, without a browser: components are turned into HTML text
// to check what they show. Interactions are checked by hand in the browser.

/** HTML of a component, for example renderHtml(<StatusBadge status={...} />). */
export function renderHtml(element) {
  return renderToStaticMarkup(element)
}

/** Only the visible text, without tags and with single spaces. */
export function renderText(element) {
  return renderHtml(element)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim()
}
