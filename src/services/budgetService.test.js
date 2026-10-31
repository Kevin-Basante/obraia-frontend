import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  approveBudget,
  createBudget,
  getBudget,
  getQuotationPreview,
  listBudgets,
  listProjectMaterials,
} from './budgetService.js'

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

/** Path and method of the request that the service sent. */
function sentRequest() {
  const [url, init] = fetchMock.mock.calls[0]
  return { path: new URL(url).pathname, method: init.method }
}

describe('budget services', () => {
  it('lists the versions of a project', async () => {
    await listBudgets('p1')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/budgets', method: 'GET' })
  })

  it('reads the quotation preview without saving', async () => {
    await getQuotationPreview('p1')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/budgets/preview', method: 'GET' })
  })

  it('saves a new version with POST', async () => {
    await createBudget('p1')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/budgets', method: 'POST' })
  })

  it('reads one version', async () => {
    await getBudget('p1', 'b1')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/budgets/b1', method: 'GET' })
  })

  it('approves a version with POST', async () => {
    await approveBudget('p1', 'b1')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/budgets/b1/approve', method: 'POST' })
  })

  it('lists the materials under the project', async () => {
    await listProjectMaterials('p1')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/materials', method: 'GET' })
  })
})
