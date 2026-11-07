import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderHtml, renderText } from '../../test/renderHtml.js'
import { YourProjects } from './YourProjects.jsx'

function render(portfolio) {
  return (
    <MemoryRouter>
      <YourProjects portfolio={portfolio} />
    </MemoryRouter>
  )
}

describe('YourProjects', () => {
  it('invites to create the first project', () => {
    const portfolio = { status: 'success', data: { projects: [] } }
    const text = renderText(render(portfolio))

    expect(text).toContain('You have no projects yet.')
    expect(text).not.toContain('Search and filter')
  })

  it('shows the error when the projects cannot be loaded', () => {
    const portfolio = { status: 'error', data: null, error: { message: 'Network error' } }

    expect(renderText(render(portfolio))).toContain('We could not load your projects: Network error')
  })

  it('always links to a new project', () => {
    const portfolio = { status: 'loading', data: null }

    expect(renderHtml(render(portfolio))).toContain('href="/projects/new"')
  })
})
