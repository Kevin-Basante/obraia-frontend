import { describe, expect, it } from 'vitest'
import { renderHtml, renderText } from '../../test/renderHtml.js'
import { PhaseTimeline } from './PhaseTimeline.jsx'

const PLAN = {
  totalDurationDays: 45,
  phases: [
    { order: 1, name: 'Cimentación', estimatedDurationDays: 15 },
    { order: 2, name: 'Cubierta', estimatedDurationDays: 30 },
  ],
}

describe('PhaseTimeline', () => {
  it('shows the total and each phase with its days', () => {
    const text = renderText(<PhaseTimeline plan={PLAN} />)
    expect(text).toContain('45 days in total (about 1,5 months)')
    expect(text).toContain('Cimentación')
    expect(text).toContain('30 days')
  })

  it('draws each phase and sizes its bar against the longest one', () => {
    const html = renderHtml(<PhaseTimeline plan={PLAN} />)
    expect(html.match(/line-art--phase/g)).toHaveLength(2)
    expect(html).toContain('width:50%')
    expect(html).toContain('width:100%')
  })
})
