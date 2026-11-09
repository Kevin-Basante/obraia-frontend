import { MemoryRouter } from 'react-router'
import { describe, expect, it } from 'vitest'
import { renderText } from '../test/renderHtml.js'
import { ApproveReportPage } from './ApproveReportPage.jsx'
import { SharedReportPage } from './SharedReportPage.jsx'

function render(page, url) {
  return renderText(<MemoryRouter initialEntries={[url]}>{page}</MemoryRouter>)
}

describe('report pages of the email and shared links', () => {
  it('the creator approves with a button, not just by opening the link', () => {
    const text = render(<ApproveReportPage />, '/approve-report?token=abc')

    expect(text).toContain('Approve the full report')
    expect(text).toContain('Approve the download')
  })

  it('an approval link without token is incomplete', () => {
    const text = render(<ApproveReportPage />, '/approve-report')

    expect(text).toContain('The link is incomplete')
    expect(text).not.toContain('Approve the download')
  })

  it('a shared link offers the public report', () => {
    const text = render(<SharedReportPage />, '/shared-report?token=abc')

    expect(text).toContain('Download the PDF')
    expect(text).toContain('does not include budgets')
  })

  it('a shared link without token is incomplete', () => {
    const text = render(<SharedReportPage />, '/shared-report')

    expect(text).toContain('The link is incomplete')
    expect(text).not.toContain('Download the PDF')
  })
})
