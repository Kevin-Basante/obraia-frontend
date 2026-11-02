import { describe, expect, it } from 'vitest'
import { toProfileForm, toProfileRequest, validateProfile } from './profileForm.js'

describe('toProfileForm', () => {
  it('shows a missing phone as an empty field', () => {
    expect(toProfileForm({ firstName: 'Ana', lastName: 'Rojas', phone: null, email: 'ana@example.com' })).toEqual({
      firstName: 'Ana',
      lastName: 'Rojas',
      phone: '',
    })
  })
})

describe('validateProfile', () => {
  it('accepts a name without phone', () => {
    expect(validateProfile({ firstName: 'Ana', lastName: 'Rojas', phone: '' })).toEqual({})
  })

  it('asks for both names', () => {
    expect(validateProfile({ firstName: ' ', lastName: '', phone: '' })).toEqual({
      firstName: 'Enter your first name',
      lastName: 'Enter your last name',
    })
  })

  it('rejects a name that is too long', () => {
    expect(validateProfile({ firstName: 'a'.repeat(101), lastName: 'Rojas', phone: '' }).firstName).toBe(
      'Use up to 100 characters',
    )
  })

  it('rejects a phone with letters', () => {
    expect(validateProfile({ firstName: 'Ana', lastName: 'Rojas', phone: 'call me' }).phone).toBe(
      'Enter a valid phone number',
    )
  })
})

describe('toProfileRequest', () => {
  it('trims every field', () => {
    expect(toProfileRequest({ firstName: ' Ana ', lastName: ' Rojas', phone: ' +57 300 000 0000 ' })).toEqual({
      firstName: 'Ana',
      lastName: 'Rojas',
      phone: '+57 300 000 0000',
    })
  })
})
