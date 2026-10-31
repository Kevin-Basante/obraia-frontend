import { describe, expect, it } from 'vitest'
import { toPhaseRequest, toTaskRequest, toWorkForm, validatePhase, validateTask, workFieldErrors } from './workForm.js'

const task = { phaseId: 'f1', name: 'Revisar niveles', plannedStartDate: '2026-11-10', plannedEndDate: '' }

describe('phase and task form', () => {
  it('accepts a valid task', () => {
    expect(validateTask(task)).toEqual({})
  })

  it('needs a phase and a name of 3 to 150 characters', () => {
    expect(validateTask({ ...task, phaseId: '', name: ' ab ' })).toEqual({
      phaseId: 'Choose the phase',
      name: 'Use 3 to 150 characters',
    })
  })

  it('allows longer task names than phase names', () => {
    const name = 'x'.repeat(120)
    expect(validateTask({ ...task, name })).toEqual({})
    expect(validatePhase({ ...task, name })).toEqual({ name: 'Use 3 to 100 characters' })
  })

  it('rejects an end before the start', () => {
    expect(validatePhase({ ...task, plannedEndDate: '2026-11-09' })).toEqual({
      plannedEndDate: 'The end cannot be before the start',
    })
  })

  it('sends trimmed names and empty dates as null', () => {
    expect(toTaskRequest({ ...task, name: '  Revisar niveles ' })).toEqual({
      phaseId: 'f1',
      name: 'Revisar niveles',
      plannedStartDate: '2026-11-10',
      plannedEndDate: null,
    })
    expect(toPhaseRequest(task)).not.toHaveProperty('phaseId')
  })

  it('fills the form from the backend', () => {
    expect(toWorkForm({ phaseId: 'f1', name: 'Solado', plannedStartDate: null, plannedEndDate: '2026-11-12' })).toEqual({
      phaseId: 'f1',
      name: 'Solado',
      plannedStartDate: '',
      plannedEndDate: '2026-11-12',
    })
  })

  it('shows the date order error of the backend under the end date', () => {
    expect(workFieldErrors({ plannedDatesInOrder: 'wrong order', name: 'bad' })).toEqual({
      name: 'bad',
      plannedEndDate: 'wrong order',
    })
    expect(workFieldErrors(undefined)).toEqual({})
  })
})
