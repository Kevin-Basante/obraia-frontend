import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { confirmDeletion, getDeletionImpact, requestDeletion } from './deletionService.js'

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

describe('project deletion services', () => {
  it('reads what the project holds', async () => {
    await getDeletionImpact('p 1')

    expect(sentRequest()).toEqual({ path: '/api/projects/p%201/deletion-impact', method: 'GET', body: undefined })
  })

  it('asks for the deletion with POST', async () => {
    await requestDeletion('p1')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/deletion-request', method: 'POST', body: undefined })
  })

  it('confirms with the token of the email', async () => {
    await confirmDeletion('t1')

    expect(sentRequest()).toEqual({ path: '/api/projects/deletion/confirm', method: 'POST', body: { token: 't1' } })
  })
})
