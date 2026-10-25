import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { confirmDeletion } from './deletionService.js'
import { addMember } from './memberService.js'
import { changeProjectStatus, listProjects, unassignSiteManager } from './projectService.js'

let fetchMock

beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue(
    new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } }),
  )
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

/** Path, method and body of the request that the service sent. */
function sentRequest() {
  const [url, init] = fetchMock.mock.calls[0]
  const { pathname, search } = new URL(url)
  return { path: pathname + search, method: init.method, body: init.body ? JSON.parse(init.body) : undefined }
}

describe('project services', () => {
  it('sends only the list filters that have a value', async () => {
    await listProjects({ status: 'draft', search: ' ' })

    expect(sentRequest().path).toBe('/api/projects?status=draft')
  })

  it('changes the status with PATCH and the status code', async () => {
    await changeProjectStatus('p1', 'in_progress')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/status', method: 'PATCH', body: { status: 'in_progress' } })
  })

  it('removes the site manager with DELETE', async () => {
    await unassignSiteManager('p1')

    expect(sentRequest()).toMatchObject({ path: '/api/projects/p1/site-manager', method: 'DELETE' })
  })

  it('adds a member by email', async () => {
    await addMember('p1', 'ana@example.com')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/members', method: 'POST', body: { email: 'ana@example.com' } })
  })

  it('confirms a deletion without a session token', async () => {
    await confirmDeletion('abc')

    expect(sentRequest()).toEqual({ path: '/api/projects/deletion/confirm', method: 'POST', body: { token: 'abc' } })
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBeUndefined()
  })
})
