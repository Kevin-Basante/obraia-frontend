import { describe, expect, it } from 'vitest'
import { renderHtml, renderText } from '../../test/renderHtml.js'
import { MaterialName } from './MaterialName.jsx'

describe('MaterialName', () => {
  it('shows the name next to a drawing', () => {
    const element = <MaterialName name="Gravilla" />
    expect(renderText(element)).toBe('Gravilla')
    expect(renderHtml(element)).toContain('line-art--material')
  })
})
