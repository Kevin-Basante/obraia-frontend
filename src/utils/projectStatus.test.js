import { describe, expect, it } from 'vitest'
import { PROJECT_STATUSES, isClosed, needsConfirmation, statusActionLabel } from './projectStatus.js'

describe('projectStatus', () => {
  it('lists the six statuses of the backend', () => {
    expect(PROJECT_STATUSES.map((status) => status.value)).toEqual([
      'draft',
      'planned',
      'in_progress',
      'paused',
      'completed',
      'cancelled',
    ])
  })

  it('names the action that moves the project to each status', () => {
    expect(statusActionLabel('in_progress')).toBe('Start work')
    expect(statusActionLabel('unknown')).toBe('unknown')
  })

  it('treats a project without next statuses as closed', () => {
    expect(isClosed({ nextStatuses: [] })).toBe(true)
    expect(isClosed({ nextStatuses: [{ code: 'paused' }] })).toBe(false)
  })

  it('asks before closing a project for good', () => {
    expect(needsConfirmation('cancelled')).toBe(true)
    expect(needsConfirmation('paused')).toBe(false)
  })
})
