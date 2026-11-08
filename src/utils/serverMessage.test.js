import { afterEach, describe, expect, it } from 'vitest'
import { setLanguage } from '../i18n/i18n.js'
import { serverMessage } from './serverMessage.js'

describe('serverMessage', () => {
  afterEach(() => setLanguage('en'))

  it('writes a known message with its values in the current language', () => {
    const response = {
      message: 'The project Casa was deleted.',
      code: 'project_deleted',
      params: { project: 'Casa', purgeDate: '2026-12-02' },
    }
    expect(serverMessage(response)).toBe(
      'The project Casa was deleted. Its data will be removed for good on Dec 2, 2026.',
    )
    setLanguage('es')
    expect(serverMessage(response)).toContain('La obra Casa fue eliminada.')
  })

  it('keeps the message when it has no code or an unknown one', () => {
    expect(serverMessage({ message: 'Done' })).toBe('Done')
    expect(serverMessage({ message: 'Done', code: 'new_code' })).toBe('Done')
  })
})
