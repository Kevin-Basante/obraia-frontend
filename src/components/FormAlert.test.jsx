import { describe, expect, it } from 'vitest'
import { renderHtml } from '../test/renderHtml.js'
import { FormAlert } from './FormAlert.jsx'

describe('FormAlert', () => {
  it('shows nothing without a message', () => {
    expect(renderHtml(<FormAlert />)).toBe('')
  })

  it('shows errors as an alert', () => {
    expect(renderHtml(<FormAlert>Wrong password</FormAlert>)).toBe(
      '<p class="form-alert form-alert--error" role="alert">Wrong password</p>',
    )
  })

  it('shows confirmations as a status', () => {
    expect(renderHtml(<FormAlert type="success">Saved</FormAlert>)).toContain('role="status"')
  })
})
