import { describe, expect, it } from 'vitest'
import { renderHtml, renderText } from '../../test/renderHtml.js'
import { KpiTile } from './KpiTile.jsx'

describe('KpiTile', () => {
  it('shows the label, the value and the detail', () => {
    const text = renderText(<KpiTile label="Progress" value="36%" detail="5 of 22 tasks done" />)

    expect(text).toBe('Progress 36% 5 of 22 tasks done')
  })

  it('takes the tone as a class and has no detail line without one', () => {
    const html = renderHtml(<KpiTile label="Risk" value="High" tone="bad" />)

    expect(html).toContain('kpi-tile--bad')
    expect(html).not.toContain('kpi-tile__detail')
  })
})
