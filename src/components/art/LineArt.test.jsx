import { describe, expect, it } from 'vitest'
import { renderHtml } from '../../test/renderHtml.js'
import { LineArt } from './LineArt.jsx'

describe('LineArt', () => {
  it('draws a phase on its own sheet, hidden from screen readers', () => {
    const html = renderHtml(<LineArt set="phase" art="roof" />)
    expect(html).toContain('viewBox="0 0 80 64"')
    expect(html).toContain('aria-hidden="true"')
    expect(html).not.toContain('line-art--animated')
  })

  it('marks the drawing as animated when asked', () => {
    expect(renderHtml(<LineArt set="material" art="sand" animated />)).toContain('line-art--animated')
  })

  it('uses the fallback drawing for an unknown name', () => {
    expect(renderHtml(<LineArt set="material" art="unknown" />)).toBe(renderHtml(<LineArt set="material" art="crate" />))
  })

  it('keeps the real length of dashed lines and dots', () => {
    const html = renderHtml(<LineArt set="phase" art="survey" />)
    expect(html).toMatch(/<path d="[^"]+" class="line-art__dash"/)
  })
})
