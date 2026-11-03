import { describe, expect, it } from 'vitest'
import { renderHtml } from '../../test/renderHtml.js'
import { StatusBadge } from './StatusBadge.jsx'

describe('StatusBadge', () => {
  it('shows the label with the color of its code', () => {
    expect(renderHtml(<StatusBadge status={{ code: 'in_progress', label: 'In progress' }} />)).toBe(
      '<span class="status-badge status-badge--in_progress">In progress</span>',
    )
  })
})
