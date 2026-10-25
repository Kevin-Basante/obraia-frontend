import { describe, expect, it } from 'vitest'
import { EMPTY_SITE_MANAGER_FORM, toSiteManagerForm, toSiteManagerRequest, validateSiteManager } from './siteManagerForm.js'

describe('siteManagerForm', () => {
  it('only requires the full name', () => {
    expect(validateSiteManager({ ...EMPTY_SITE_MANAGER_FORM, fullName: 'Pedro Gomez' })).toEqual({})
    expect(validateSiteManager(EMPTY_SITE_MANAGER_FORM)).toEqual({ fullName: 'Use 3 to 150 characters' })
  })

  it('checks the document and phone when they are filled in', () => {
    const errors = validateSiteManager({ fullName: 'Pedro Gomez', documentNumber: '12', phone: 'call me' })

    expect(Object.keys(errors).sort()).toEqual(['documentNumber', 'phone'])
  })

  it('sends empty optional fields as null', () => {
    expect(toSiteManagerRequest({ fullName: ' Pedro ', documentNumber: ' ', phone: '300 123 4567' })).toEqual({
      fullName: 'Pedro',
      documentNumber: null,
      phone: '300 123 4567',
    })
  })

  it('fills the form with a saved site manager', () => {
    expect(toSiteManagerForm({ fullName: 'Pedro', documentNumber: null, phone: null })).toEqual({
      fullName: 'Pedro',
      documentNumber: '',
      phone: '',
    })
  })
})
