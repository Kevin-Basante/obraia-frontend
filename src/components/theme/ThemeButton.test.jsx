import { describe, expect, it } from 'vitest'
import { renderHtml } from '../../test/renderHtml.js'
import { ThemeButton } from './ThemeButton.jsx'

describe('ThemeButton', () => {
  it('offers the dark theme while the light one is on', () => {
    const html = renderHtml(<ThemeButton theme="light" onToggle={() => {}} />)

    expect(html).toContain('aria-label="Switch to the dark theme"')
  })

  it('offers the light theme while the dark one is on', () => {
    const html = renderHtml(<ThemeButton theme="dark" onToggle={() => {}} />)

    expect(html).toContain('aria-label="Switch to the light theme"')
    expect(html).toContain('<circle')
  })
})
