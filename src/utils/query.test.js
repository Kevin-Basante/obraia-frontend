import { describe, expect, it } from 'vitest'
import { buildQuery } from './query.js'

describe('buildQuery', () => {
  it('returns an empty string when there are no filters', () => {
    expect(buildQuery()).toBe('')
    expect(buildQuery({ category: '', search: '   ', area: null, size: undefined })).toBe('')
  })

  it('keeps only the filters with a value and trims them', () => {
    expect(buildQuery({ category: 'steel', search: ' arena ', department: '' })).toBe('?category=steel&search=arena')
  })

  it('encodes accents and spaces', () => {
    expect(buildQuery({ department: 'Bogotá D.C.' })).toBe('?department=Bogot%C3%A1+D.C.')
  })

  it('accepts numbers', () => {
    expect(buildQuery({ area: 120.5 })).toBe('?area=120.5')
  })
})
