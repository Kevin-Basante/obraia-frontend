import { describe, expect, it } from 'vitest'
import { renderHtml, renderText } from '../../test/renderHtml.js'
import { formatProgress } from '../../utils/workStatus.js'
import { ProgressBar } from './ProgressBar.jsx'

describe('ProgressBar', () => {
  it('fills the bar and shows the percentage', () => {
    const html = renderHtml(<ProgressBar value={40} />)

    expect(html).toContain('aria-valuenow="40"')
    expect(html).toContain('width:40%')
    expect(renderText(<ProgressBar value={40} />)).toBe(formatProgress(40).replace(/\s+/g, ' '))
  })

  it('keeps the value between 0 and 100', () => {
    expect(renderHtml(<ProgressBar value={130} />)).toContain('aria-valuenow="100"')
    expect(renderHtml(<ProgressBar value={-5} />)).toContain('aria-valuenow="0"')
  })

  it('uses the label for screen readers', () => {
    expect(renderHtml(<ProgressBar value={10} label="Budget spent" />)).toContain('aria-label="Budget spent"')
  })
})
