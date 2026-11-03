import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getHealth, getHello } from './healthService.js'

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

describe('health services', () => {
  it('reads the hello message', async () => {
    await getHello()

    expect(sentRequest()).toEqual({ path: '/api/hello', method: 'GET', body: undefined })
  })

  it('reads the server status', async () => {
    await getHealth()

    expect(sentRequest()).toEqual({ path: '/api/health', method: 'GET', body: undefined })
  })
})
