import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderHtml, renderText } from '../../test/renderHtml.js'
import { AnalysisResult } from './AnalysisResult.jsx'

const wall = {
  id: 'm1',
  elementLabel: 'Wall',
  notes: null,
  blueprintFilename: 'plano.pdf',
  floorNumber: 1,
  lengthM: 36,
  widthM: null,
  heightM: 2.4,
  quantity: 1,
  amount: 86.4,
  baseUnit: 'm2',
  sourceLabel: 'AI',
  discrepancyPct: null,
}

function render(result) {
  const element = (
    <MemoryRouter>
      <AnalysisResult projectId="p1" filename="plano.pdf" result={result} />
    </MemoryRouter>
  )
  return { html: renderHtml(element), text: renderText(element) }
}

describe('AnalysisResult', () => {
  it('shows the summary, the warnings and the measurements', () => {
    const { html, text } = render({ measurements: [wall], warnings: ['Escala no visible'], discarded: 1, model: 'gemini' })

    expect(text).toContain('The AI found 1 measurement and left out 1 it could not use.')
    expect(text).toContain('Warnings Escala no visible')
    expect(text).toContain('Wall')
    expect(html).toContain('href="/projects/p1/measurements/comparison"')
  })

  it('does not repeat the file name in each row', () => {
    const { text } = render({ measurements: [wall], warnings: [], discarded: 0, model: 'gemini' })

    expect(text.match(/plano\.pdf/g)).toHaveLength(1)
    expect(text).not.toContain('Warnings')
  })
})
