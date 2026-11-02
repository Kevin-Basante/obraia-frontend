import { describe, expect, it } from 'vitest'
import { joinNames, joinedProjectsText } from './accountDeletion.js'

describe('joinNames', () => {
  it('quotes a single name', () => {
    expect(joinNames(['Casa Norte'])).toBe('“Casa Norte”')
  })

  it('joins the last two names with "and"', () => {
    expect(joinNames(['Casa Norte', 'Casa Sur', 'Local'])).toBe('“Casa Norte”, “Casa Sur” and “Local”')
  })

  it('returns an empty text for no names', () => {
    expect(joinNames([])).toBe('')
  })
})

describe('joinedProjectsText', () => {
  it('says nothing when the user only has own projects', () => {
    expect(joinedProjectsText(0)).toBeNull()
  })

  it('uses the singular for one project', () => {
    expect(joinedProjectsText(1)).toBe('You leave 1 project created by another person. It stays for its owner.')
  })

  it('counts several projects', () => {
    expect(joinedProjectsText(3)).toContain('You leave 3 projects')
  })
})
