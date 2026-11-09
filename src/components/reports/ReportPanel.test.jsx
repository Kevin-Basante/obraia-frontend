import { afterEach, describe, expect, it } from 'vitest'
import { setLanguage } from '../../i18n/i18n.js'
import { renderText } from '../../test/renderHtml.js'
import { ReportPanel } from './ReportPanel.jsx'

afterEach(() => setLanguage('en'))

describe('ReportPanel', () => {
  it('offers the public report and explains the full one', () => {
    const text = renderText(<ReportPanel projectId="p1" projectName="Casa Basante" />)

    expect(text).toContain('Download the analysis')
    expect(text).toContain('Download public PDF')
    expect(text).toContain('Copy share link')
    expect(text).toContain('Full report')
    expect(text).toContain('The creator of the project approves who downloads it.')
  })

  it('follows the language of the page', () => {
    setLanguage('es')

    const text = renderText(<ReportPanel projectId="p1" projectName="Casa Basante" />)

    expect(text).toContain('Descargar el análisis')
    expect(text).toContain('Descargar PDF público')
    expect(text).toContain('Informe completo')
  })
})
