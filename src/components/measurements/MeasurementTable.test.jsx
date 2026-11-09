import { describe, expect, it } from 'vitest'
import { setLanguage } from '../../i18n/i18n.js'
import { renderText } from '../../test/renderHtml.js'
import { MeasurementTable } from './MeasurementTable.jsx'

const WALL = {
  id: 'm1',
  elementType: 'wall',
  elementLabel: 'Muro',
  floorNumber: 1,
  lengthM: 4,
  widthM: null,
  heightM: 2.4,
  quantity: 1,
  amount: 9.6,
  baseUnit: 'm2',
  source: 'manual',
  sourceLabel: 'Manual',
  discrepancyPct: null,
  notes: null,
}

describe('MeasurementTable', () => {
  it('shows each measurement with its dimensions', () => {
    const text = renderText(<MeasurementTable measurements={[WALL]} />)
    expect(text).toContain('Dimensions (m)')
    expect(text).toContain('4 × 2,4')
  })

  it('writes the headers in Spanish', () => {
    setLanguage('es')
    try {
      expect(renderText(<MeasurementTable measurements={[WALL]} />)).toContain('Dimensiones (m)')
    } finally {
      setLanguage('en')
    }
  })
})
