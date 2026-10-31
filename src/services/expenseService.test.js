import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createExpense, deleteExpense, getExpenseSummary, listExpenses } from './expenseService.js'

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

/** Path, method and body of the request that the service sent. */
function sentRequest() {
  const [url, init] = fetchMock.mock.calls[0]
  return { path: new URL(url).pathname, method: init.method, body: init.body ? JSON.parse(init.body) : undefined }
}

describe('expense services', () => {
  it('lists the expenses of a project', async () => {
    await listExpenses('p1')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/expenses', method: 'GET', body: undefined })
  })

  it('reads the summary by category', async () => {
    await getExpenseSummary('p1')

    expect(sentRequest().path).toBe('/api/projects/p1/expenses/summary')
  })

  it('sends a new expense with POST', async () => {
    const expense = { category: 'materials', description: 'Cemento', amount: 650000 }

    await createExpense('p1', expense)

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/expenses', method: 'POST', body: expense })
  })

  it('deletes an expense', async () => {
    await deleteExpense('p1', 'e1')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/expenses/e1', method: 'DELETE', body: undefined })
  })
})
