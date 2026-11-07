import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getPortfolio, getProjectOverview } from './dashboardService.js'

let fetchMock

beforeEach(() => {
  fetchMock = vi
    .fn()
    .mockResolvedValue(new Response('{}', { status: 200, headers: { 'Content-Type': 'application/json' } }))
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function sentRequest() {
  const [url, init] = fetchMock.mock.calls[0]
  return { path: new URL(url).pathname, method: init.method }
}

describe('dashboard services', () => {
  it('reads the dashboard of all the projects', async () => {
    await getPortfolio()

    expect(sentRequest()).toEqual({ path: '/api/dashboard', method: 'GET' })
  })

  it('reads the dashboard of one project', async () => {
    await getProjectOverview('p 1')

    expect(sentRequest()).toEqual({ path: '/api/dashboard/projects/p%201', method: 'GET' })
  })
})
