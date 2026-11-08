import { afterEach, describe, expect, it } from 'vitest'
import { renderHtml } from '../../test/renderHtml.js'
import { setLanguage } from '../../i18n/i18n.js'
import { LanguageButton } from './LanguageButton.jsx'

describe('LanguageButton', () => {
  afterEach(() => setLanguage('en'))

  it('offers Spanish while the site is in English', () => {
    const html = renderHtml(<LanguageButton language="en" onChange={() => {}} />)

    expect(html).toContain('aria-label="Switch to Spanish"')
    expect(html).toContain('>ES<')
  })

  it('offers English while the site is in Spanish', () => {
    setLanguage('es')
    const html = renderHtml(<LanguageButton language="es" onChange={() => {}} />)

    expect(html).toContain('aria-label="Cambiar a inglés"')
    expect(html).toContain('>EN<')
  })
})
