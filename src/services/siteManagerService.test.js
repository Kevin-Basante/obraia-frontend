import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  createSiteManager,
  deleteSiteManager,
  listSiteManagers,
  updateSiteManager,
} from './siteManagerService.js'

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

function sentRequest(index = 0) {
  const [url, init] = fetchMock.mock.calls[index]
  const { pathname, search } = new URL(url)
  return { path: pathname + search, method: init.method, body: init.body ? JSON.parse(init.body) : undefined }
}

describe('site manager services', () => {
  const siteManager = { fullName: 'Luis Pérez', phone: '3001234567' }

  it('lists the site managers', async () => {
    await listSiteManagers()

    expect(sentRequest()).toEqual({ path: '/api/site-managers', method: 'GET', body: undefined })
  })

  it('creates and updates a site manager', async () => {
    await createSiteManager(siteManager)
    await updateSiteManager('s1', siteManager)

    expect(sentRequest(0)).toEqual({ path: '/api/site-managers', method: 'POST', body: siteManager })
    expect(sentRequest(1)).toEqual({ path: '/api/site-managers/s1', method: 'PUT', body: siteManager })
  })

  it('deletes a site manager', async () => {
    await deleteSiteManager('s1')

    expect(sentRequest()).toEqual({ path: '/api/site-managers/s1', method: 'DELETE', body: undefined })
  })
})
