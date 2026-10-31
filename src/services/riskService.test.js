import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { assessRisk, getRiskOverview } from './riskService.js'

let fetchMock

beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue(
    new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }),
  )
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function sentRequest() {
  const [url, init] = fetchMock.mock.calls[0]
  return { path: new URL(url).pathname, method: init.method }
}

describe('risk services', () => {
  it('reads the risk of a project', async () => {
    await getRiskOverview('p1')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/risk', method: 'GET' })
  })

  it('asks for a new assessment with POST', async () => {
    await assessRisk('p1')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/risk/assess', method: 'POST' })
  })
})
