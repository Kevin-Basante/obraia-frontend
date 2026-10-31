import { describe, expect, it } from 'vitest'
import { analysisErrorMessage, analysisSummary, analyzeLabel, measurementSourceText } from './analysis.js'

describe('analysis helpers', () => {
  it('explains the errors of the AI', () => {
    expect(analysisErrorMessage({ code: 'AI_SERVICE_DISABLED', message: 'x' })).toBe(
      'The AI service is not configured on the server yet.',
    )
    expect(analysisErrorMessage({ code: 'AI_SERVICE_FAILED', message: 'x' })).toMatch(/could not read/)
    expect(analysisErrorMessage({ code: 'AI_LIMIT_REACHED', message: 'Try again later' })).toBe('Try again later')
    expect(analysisErrorMessage(null)).toBe('')
  })

  it('offers to analyze again a blueprint already read', () => {
    expect(analyzeLabel({ processingStatus: { code: 'completed' } })).toBe('Analyze again')
    expect(analyzeLabel({ processingStatus: { code: 'pending' } })).toBe('Analyze with AI')
    expect(analyzeLabel({ processingStatus: { code: 'failed' } })).toBe('Analyze with AI')
  })

  it('summarizes the result', () => {
    expect(analysisSummary({ measurements: [{}], discarded: 0, cached: false })).toBe('The AI found 1 measurement.')
    expect(analysisSummary({ measurements: [{}, {}], discarded: 2, cached: true })).toBe(
      'The AI found 2 measurements and left out 2 it could not use. This file was already read, so the AI was not called again.',
    )
  })

  it('says where the quoted measurements come from', () => {
    expect(measurementSourceText('ocr')).toMatch(/AI/)
    expect(measurementSourceText('manual')).toBe('typed by hand')
  })
})
