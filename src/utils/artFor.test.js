import { describe, expect, it } from 'vitest'
import { materialArt, normalize, phaseArt } from './artFor.js'

describe('normalize', () => {
  it('removes accents and upper case', () => {
    expect(normalize('Excavación y Cimentación')).toBe('excavacion y cimentacion')
  })

  it('turns a missing text into an empty one', () => {
    expect(normalize(undefined)).toBe('')
  })
})

describe('phaseArt', () => {
  it.each([
    ['Preliminares y replanteo', 'survey'],
    ['Excavación y movimiento de tierras', 'excavation'],
    ['Cimentación', 'foundation'],
    ['Estructura (columnas, vigas y placas)', 'structure'],
    ['Mampostería', 'masonry'],
    ['Cubierta', 'roof'],
    ['Instalaciones hidrosanitarias y eléctricas', 'installations'],
    ['Pañetes, pisos y acabados', 'finishes'],
  ])('draws "%s" as %s', (name, art) => {
    expect(phaseArt(name)).toBe(art)
  })

  it('uses a hard hat for an unknown phase', () => {
    expect(phaseArt('Limpieza final')).toBe('helmet')
  })
})

describe('materialArt', () => {
  it.each([
    ['Arena de pega', 'sand'],
    ['Arena de río (concreto)', 'sand'],
    ['Gravilla', 'gravel'],
    ['Cemento gris uso general', 'cement'],
    ['Pintura vinilo tipo 2', 'paint'],
    ['Bloque de arcilla No. 5', 'block'],
    ['Teja de fibrocemento No. 6', 'sheet'],
    ['Alambre negro calibre 18', 'wire'],
    ['Varilla corrugada 1/2" x 6 m', 'rebar'],
  ])('draws "%s" as %s', (name, art) => {
    expect(materialArt({ name })).toBe(art)
  })

  it('falls back to the category when the name has no keyword', () => {
    expect(materialArt({ name: 'Malla electrosoldada', category: { code: 'steel' } })).toBe('rebar')
  })

  it('uses a crate when neither the name nor the category is known', () => {
    expect(materialArt({ name: 'Andamio', category: { code: 'tools' } })).toBe('crate')
  })
})
