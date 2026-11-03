import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  changeTaskStatus,
  createTask,
  deleteTask,
  listProgressReports,
  reportProgress,
  updateTask,
} from './taskService.js'

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

describe('task services', () => {
  const task = { name: 'Excavation', phaseId: 'f1' }

  it('creates, updates and deletes a task', async () => {
    await createTask('p1', task)
    await updateTask('p1', 't1', task)
    await deleteTask('p1', 't1')

    expect(sentRequest(0)).toEqual({ path: '/api/projects/p1/tasks', method: 'POST', body: task })
    expect(sentRequest(1)).toEqual({ path: '/api/projects/p1/tasks/t1', method: 'PUT', body: task })
    expect(sentRequest(2)).toEqual({ path: '/api/projects/p1/tasks/t1', method: 'DELETE', body: undefined })
  })

  it('changes the status with PATCH', async () => {
    await changeTaskStatus('p1', 't1', 'DONE')

    expect(sentRequest()).toEqual({ path: '/api/projects/p1/tasks/t1/status', method: 'PATCH', body: { status: 'DONE' } })
  })

  it('lists and sends progress reports', async () => {
    const report = { percent: 40, notes: 'Avance' }
    await listProgressReports('p1', 't1')
    await reportProgress('p1', 't1', report)

    expect(sentRequest(0)).toEqual({ path: '/api/projects/p1/tasks/t1/progress', method: 'GET', body: undefined })
    expect(sentRequest(1)).toEqual({ path: '/api/projects/p1/tasks/t1/progress', method: 'POST', body: report })
  })
})
