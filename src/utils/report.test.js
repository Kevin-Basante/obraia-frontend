import { afterEach, describe, expect, it, vi } from 'vitest'
import { setLanguage } from '../i18n/i18n.js'
import { fullReportAction, fullReportText, reportFileName, saveFile, slug } from './report.js'

afterEach(() => {
  setLanguage('en')
  vi.unstubAllGlobals()
})

describe('report helpers', () => {
  it('turns a project name into a file name without accents or symbols', () => {
    expect(slug('Casa de campo Chachagüí')).toBe('casa-de-campo-chachagui')
    expect(slug('¿?')).toBe('project')
    expect(reportFileName('Casa Basante', 'public')).toBe('casa-basante-public-report.pdf')
    setLanguage('es')
    expect(reportFileName('Casa Basante', 'full')).toBe('casa-basante-informe-completo.pdf')
  })

  it('picks what the user can do with the full report', () => {
    expect(fullReportAction(null)).toBeNull()
    expect(fullReportAction({ status: 'owner' })).toBe('download')
    expect(fullReportAction({ status: 'approved' })).toBe('download')
    expect(fullReportAction({ status: 'pending' })).toBe('wait')
    expect(fullReportAction({ status: 'expired' })).toBe('ask')
    expect(fullReportAction({ status: 'none' })).toBe('ask')
  })

  it('explains where the request stands', () => {
    setLanguage('es')
    expect(fullReportText({ status: 'owner' })).toContain('Tú creaste la obra')
    expect(fullReportText({ status: 'pending', requestedAt: '2026-11-09T15:00:00Z' })).toContain('Lo pediste el')
    expect(fullReportText({ status: 'approved', downloadUntil: '2026-11-10T15:00:00Z' })).toContain('hasta el')
    expect(fullReportText({ status: 'none' })).toContain('pídeselo al creador')
  })

  it('saves a file through a link', () => {
    vi.stubGlobal('URL', { createObjectURL: vi.fn(() => 'blob:1'), revokeObjectURL: vi.fn() })
    vi.stubGlobal('setTimeout', (callback) => callback())
    const link = { click: vi.fn(), remove: vi.fn() }
    const doc = { createElement: vi.fn(() => link), body: { appendChild: vi.fn() } }

    saveFile(new Blob(['%PDF']), 'casa.pdf', doc)

    expect(link.href).toBe('blob:1')
    expect(link.download).toBe('casa.pdf')
    expect(link.click).toHaveBeenCalled()
    expect(link.remove).toHaveBeenCalled()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:1')
  })
})
