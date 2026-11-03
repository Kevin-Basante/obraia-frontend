import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { addMember, listMembers, removeMember } from './memberService.js'

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

describe('member services', () => {
  it('lists the members', async () => {
    await listMembers('p1')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/members', method: 'GET', body: undefined })
  })

  it('adds a member by email', async () => {
    await addMember('p1', 'ana@test.co')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/members', method: 'POST', body: { email: 'ana@test.co' } })
  })

  it('removes a member', async () => {
    await removeMember('p1', 'u7')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/members/u7', method: 'DELETE', body: undefined })
  })
})
