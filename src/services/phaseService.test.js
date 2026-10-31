import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { changePhaseStatus, deletePlan, generatePlan, getPlanPreview, updatePhase } from './phaseService.js'
import { changeTaskStatus, listProgressReports, reportProgress, updateTask } from './taskService.js'

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

/** Path, method and JSON body of the request that the service sent. */
function sentRequest() {
  const [url, init] = fetchMock.mock.calls[0]
  return { path: new URL(url).pathname, method: init.method, body: init.body ? JSON.parse(init.body) : undefined }
}

describe('phase services', () => {
  it('reads the preview without changing anything', async () => {
    await getPlanPreview('p1')

    expect(sentRequest()).toMatchObject({ path: '/api/projects/p1/phases/preview', method: 'GET' })
  })

  it('creates the plan with POST', async () => {
    await generatePlan('p1')

    expect(sentRequest()).toMatchObject({ path: '/api/projects/p1/phases/generate', method: 'POST' })
  })

  it('deletes the plan with DELETE', async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }))

    await deletePlan('p1')

    expect(sentRequest()).toMatchObject({ path: '/api/projects/p1/phases', method: 'DELETE' })
  })

  it('edits a phase with PUT', async () => {
    await updatePhase('p1', 'f1', { name: 'Cimentación' })

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/phases/f1', method: 'PUT', body: { name: 'Cimentación' } })
  })

  it('sends the new status of a phase', async () => {
    await changePhaseStatus('p1', 'f1', 'in_progress')

    expect(sentRequest()).toEqual({
      path: '/api/projects/p1/phases/f1/status',
      method: 'PATCH',
      body: { status: 'in_progress' },
    })
  })
})

describe('task services', () => {
  it('moves a task to another phase with PUT', async () => {
    await updateTask('p1', 't1', { phaseId: 'f2', name: 'Solado' })

    expect(sentRequest()).toMatchObject({ path: '/api/projects/p1/tasks/t1', method: 'PUT' })
  })

  it('sends the new status of a task', async () => {
    await changeTaskStatus('p1', 't1', 'completed')

    expect(sentRequest()).toEqual({
      path: '/api/projects/p1/tasks/t1/status',
      method: 'PATCH',
      body: { status: 'completed' },
    })
  })

  it('reads and sends progress reports', async () => {
    await listProgressReports('p1', 't1')
    await reportProgress('p1', 't1', { completionPercentage: 40 })

    expect(sentRequest().path).toBe('/api/projects/p1/tasks/t1/progress')
    const [, init] = fetchMock.mock.calls[1]
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual({ completionPercentage: 40 })
  })
})
