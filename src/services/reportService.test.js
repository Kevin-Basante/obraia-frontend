import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  approveReport,
  downloadReport,
  downloadSharedReport,
  getFullReportAccess,
  requestFullReport,
  shareReport,
  wakeAi,
} from './reportService.js'

let fetchMock

beforeEach(() => {
  fetchMock = vi.fn().mockImplementation(() =>
    Promise.resolve(new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } })),
  )
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function sentRequest(index = 0) {
  const [url, init] = fetchMock.mock.calls[index]
  const { pathname, search } = new URL(url)
  return { path: pathname + search, method: init.method, body: init.body ? JSON.parse(init.body) : undefined }
}

describe('report services', () => {
  it('downloads a report as a file in the language of the page', async () => {
    fetchMock.mockResolvedValue(new Response('%PDF', { status: 200, headers: { 'Content-Type': 'application/pdf' } }))

    const file = await downloadReport('p 1', 'public', 'es')

    expect(sentRequest()).toEqual({ path: '/api/projects/p%201/reports/public?lang=es', method: 'GET', body: undefined })
    expect(await file.text()).toBe('%PDF')
  })

  it('reads the access to the full report and asks for it', async () => {
    await getFullReportAccess('p1')
    await requestFullReport('p1')

    expect(sentRequest(0).path).toBe('/api/projects/p1/reports/full/access')
    expect(sentRequest(1)).toEqual({ path: '/api/projects/p1/reports/full/requests', method: 'POST', body: undefined })
  })

  it('creates a shared link', async () => {
    await shareReport('p1')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/reports/share', method: 'POST', body: undefined })
  })

  it('approves and downloads with the tokens of the links, without a session', async () => {
    await approveReport('t1')
    await downloadSharedReport('t2', 'en')

    expect(sentRequest(0)).toEqual({ path: '/api/reports/approve', method: 'POST', body: { token: 't1' } })
    expect(sentRequest(1)).toEqual({ path: '/api/reports/shared', method: 'POST', body: { token: 't2', lang: 'en' } })
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined()
  })

  it('wakes the AI', async () => {
    await wakeAi()

    expect(sentRequest().path).toBe('/api/ai/wake')
  })
})
