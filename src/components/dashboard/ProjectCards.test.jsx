import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderHtml, renderText } from '../../test/renderHtml.js'
import { ProjectCards } from './ProjectCards.jsx'

const project = {
  id: 4,
  name: 'Casa Basante',
  projectTypeName: 'Vivienda unifamiliar',
  city: 'Pasto',
  status: { code: 'in_progress', label: 'In progress' },
}

function card(changes = {}) {
  return { project, progressPct: 36.4, approvedBudget: 1000, totalSpent: 300, spentPct: 30, risk: null, ...changes }
}

function render(cards) {
  return (
    <MemoryRouter>
      <ProjectCards cards={cards} />
    </MemoryRouter>
  )
}

describe('ProjectCards', () => {
  it('opens the dashboard of each project', () => {
    const html = renderHtml(render([card()]))

    expect(html).toContain('href="/projects/4"')
    expect(html).toContain('Budget of Casa Basante spent')
  })

  it('shows the risk score when the project was assessed', () => {
    const risk = { level: { code: 'high', label: 'High' }, score: 69.5, predictedDelayDays: 38, assessedAt: null }
    const text = renderText(render([card({ risk })]))

    expect(text).toContain('High')
    expect(text).toContain('69,5 / 100')
  })

  it('says when there is no approved budget and no assessment', () => {
    const text = renderText(render([card({ approvedBudget: null, spentPct: null })]))

    expect(text).toContain('No approved budget')
    expect(text).toContain('Not assessed yet')
  })
})
