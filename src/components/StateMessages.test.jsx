import { describe, expect, it } from 'vitest'
import { renderText } from '../test/renderHtml.js'
import { EmptyState } from './catalog/EmptyState.jsx'
import { ResultCount } from './catalog/ResultCount.jsx'
import { ErrorState } from './ErrorState.jsx'
import { LoadingState } from './LoadingState.jsx'

describe('state messages', () => {
  it('loading explains that the server may be waking up', () => {
    expect(renderText(<LoadingState />)).toContain('the first response can take about a minute')
  })

  it('loading can hide its message', () => {
    expect(renderText(<LoadingState title="Saving…" message={null} />)).toBe('Saving…')
  })

  it('error shows the message and a retry button', () => {
    const text = renderText(<ErrorState error={new Error('Network down')} onRetry={() => {}} />)

    expect(text).toContain('Could not load the data Network down')
    expect(text).toContain('Retry')
  })

  it('error without details says it is unknown', () => {
    expect(renderText(<ErrorState onRetry={() => {}} />)).toContain('Unknown error')
  })

  it('empty state shows its text', () => {
    expect(renderText(<EmptyState>No materials match</EmptyState>)).toBe('No materials match')
  })

  it('result count uses singular or plural', () => {
    expect(renderText(<ResultCount count={1} singular="city" plural="cities" />)).toBe('1 city')
    expect(renderText(<ResultCount count={3} singular="city" plural="cities" updating />)).toBe(
      '3 cities · updating…',
    )
  })
})
