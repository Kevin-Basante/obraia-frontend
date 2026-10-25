import { describe, expect, it } from 'vitest'
import { validateEmail, validateNewPassword, validatePassword, validateRegistration } from './validation.js'

const VALID_FORM = {
  firstName: 'Ana',
  lastName: 'Rojas',
  email: 'ana@example.com',
  password: 'secret123',
  confirmPassword: 'secret123',
  phone: '',
}

describe('validateEmail', () => {
  it('accepts a normal address, ignoring spaces around it', () => {
    expect(validateEmail('  ana@example.com ')).toBeNull()
  })

  it('asks for the email when it is empty', () => {
    expect(validateEmail('   ')).toBe('Enter your email')
  })

  it('rejects an address without a domain', () => {
    expect(validateEmail('ana@example')).toBe('Enter a valid email')
  })
})

describe('validatePassword', () => {
  it('accepts letters and numbers with 8 or more characters', () => {
    expect(validatePassword('secret123')).toBeNull()
  })

  it('rejects passwords that are too short or too long', () => {
    expect(validatePassword('abc123')).toBe('Use 8 to 72 characters')
    expect(validatePassword(`a1${'x'.repeat(71)}`)).toBe('Use 8 to 72 characters')
  })

  it('asks for at least one letter and one number', () => {
    expect(validatePassword('onlyletters')).toBe('Include at least one letter and one number')
    expect(validatePassword('12345678')).toBe('Include at least one letter and one number')
  })
})

describe('validateRegistration', () => {
  it('returns no errors for a complete form', () => {
    expect(validateRegistration(VALID_FORM)).toEqual({})
  })

  it('returns one message per invalid field', () => {
    const errors = validateRegistration({ ...VALID_FORM, firstName: ' ', email: 'nope', confirmPassword: 'other123' })
    expect(Object.keys(errors).sort()).toEqual(['confirmPassword', 'email', 'firstName'])
  })

  it('checks the phone only when one is typed', () => {
    expect(validateRegistration({ ...VALID_FORM, phone: '+57 300 123 4567' })).toEqual({})
    expect(validateRegistration({ ...VALID_FORM, phone: 'call me' }).phone).toBe('Enter a valid phone number')
  })
})

describe('validateNewPassword', () => {
  it('requires both passwords to match', () => {
    expect(validateNewPassword({ password: 'secret123', confirmPassword: 'secret124' })).toEqual({
      confirmPassword: 'The passwords do not match',
    })
  })
})
