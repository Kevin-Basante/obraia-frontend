import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderHtml, renderText } from '../../test/renderHtml.js'
import { UpcomingTasks } from './UpcomingTasks.jsx'

const task = {
  id: 31,
  name: 'Footing rebar',
  phaseName: 'Foundation',
  status: { code: 'in_progress', label: 'In progress' },
  plannedStartDate: null,
  plannedEndDate: null,
  progressPct: 70,
  late: false,
}

function render(tasks) {
  return (
    <MemoryRouter>
      <UpcomingTasks projectId={4} tasks={tasks} />
    </MemoryRouter>
  )
}

describe('UpcomingTasks', () => {
  it('links each task to its progress page', () => {
    const html = renderHtml(render([task]))

    expect(html).toContain('href="/projects/4/tasks/31"')
    expect(html).not.toContain('dashboard-late')
  })

  it('shows the phase of the task and says when it has no dates', () => {
    const text = renderText(render([task]))

    expect(text).toContain('Foundation')
    expect(text).toContain('No dates')
  })

  it('says when there are no pending tasks', () => {
    expect(renderText(render([]))).toContain('There are no pending tasks.')
  })
})
