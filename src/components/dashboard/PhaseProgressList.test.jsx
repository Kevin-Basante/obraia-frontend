import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderHtml, renderText } from '../../test/renderHtml.js'
import { PhaseProgressList } from './PhaseProgressList.jsx'

const phase = {
  id: 9,
  name: 'Foundation',
  order: 3,
  status: { code: 'in_progress', label: 'In progress' },
  progressPct: 70,
  late: true,
  plannedStartDate: '2026-09-15',
  plannedEndDate: '2026-09-30',
  taskCount: 4,
}

function render(phases) {
  return (
    <MemoryRouter>
      <PhaseProgressList projectId={4} phases={phases} />
    </MemoryRouter>
  )
}

describe('PhaseProgressList', () => {
  it('shows each phase with its order, status and late tag', () => {
    const text = renderText(render([phase]))

    expect(text).toContain('03 Foundation')
    expect(text).toContain('In progress')
    expect(text).toContain('Late')
  })

  it('links to the phases page', () => {
    expect(renderHtml(render([phase]))).toContain('href="/projects/4/phases"')
  })

  it('says when the plan has not been created', () => {
    expect(renderText(render([]))).toContain('The plan has not been created yet.')
  })
})
