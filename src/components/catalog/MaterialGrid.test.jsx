import { describe, expect, it } from 'vitest'
import { renderHtml } from '../../test/renderHtml.js'
import { MaterialGrid } from './MaterialGrid.jsx'

const CEMENT = {
  id: 'm1',
  name: 'Cemento gris uso general',
  category: { code: 'cement_concrete', label: 'Cement and concrete' },
  unit: 'bag 50 kg',
  referencePrice: 32000,
  priceUpdatedAt: '2026-10-01',
}

describe('MaterialGrid', () => {
  it('shows each material with its category, unit and a drawing', () => {
    const html = renderHtml(<MaterialGrid materials={[CEMENT]} />)
    expect(html).toContain('Cemento gris uso general')
    expect(html).toContain('Cement and concrete')
    expect(html).toContain('bag 50 kg')
    expect(html).toContain('class="line-art line-art--material"')
  })

  it('fades the cards while new results load', () => {
    expect(renderHtml(<MaterialGrid materials={[CEMENT]} updating />)).toContain('material-grid--updating')
  })
})
