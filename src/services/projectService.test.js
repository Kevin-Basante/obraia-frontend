import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { confirmDeletion } from './deletionService.js'
import { addMember } from './memberService.js'
import {
  assignSiteManager,
  changeProjectStatus,
  createProject,
  getProject,
  listProjects,
  unassignSiteManager,
  updateProject,
} from './projectService.js'

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

describe('project services by id', () => {
  function request(index) {
    const [url, init] = fetchMock.mock.calls[index]
    return { path: new URL(url).pathname, method: init.method, body: init.body ? JSON.parse(init.body) : undefined }
  }

  it('reads, creates and updates a project', async () => {
    const project = { name: 'Casa Ruiz', floors: 1 }
    await getProject('p1')
    await createProject(project)
    await updateProject('p1', project)

    expect(request(0)).toEqual({ path: '/api/projects/p1', method: 'GET', body: undefined })
    expect(request(1)).toEqual({ path: '/api/projects', method: 'POST', body: project })
    expect(request(2)).toEqual({ path: '/api/projects/p1', method: 'PUT', body: project })
  })

  it('assigns a site manager with PUT', async () => {
    await assignSiteManager('p1', 's1')

    expect(request(0)).toEqual({ path: '/api/projects/p1/site-manager', method: 'PUT', body: { siteManagerId: 's1' } })
  })
})
