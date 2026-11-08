import { t } from '../i18n/i18n.js'
// Helpers for reading blueprints with the AI (POST .../blueprints/{id}/analyze).

/** Errors of the AI, explained for the user. The limit error already says when to try again. */
const AI_ERRORS = {
  AI_SERVICE_DISABLED: 'analysis.theAiServiceIsNot',
  AI_SERVICE_FAILED: 'analysis.theAiCouldNotRead',
}

export function analysisErrorMessage(error) {
  if (!error) return ''
  return AI_ERRORS[error.code] ? t(AI_ERRORS[error.code]) : error.message
}

/** Text of the button: a blueprint already read can be read again. */
export function analyzeLabel(blueprint) {
  return blueprint.processingStatus.code === 'completed' ? t('analysis.analyzeAgain') : t('analysis.analyzeWithAi')
}

/** One sentence about the result: what was saved, what was left out and whether the cache answered. */
export function analysisSummary(result) {
  let text = t('analysis.found', { count: result.measurements.length })
  if (result.discarded > 0) text += t('analysis.leftOut', { count: result.discarded })
  text += '.'
  if (result.cached) text += t('analysis.thisFileWasAlreadyRead')
  return text
}

/** Where the measurements of the quotation come from, in words. */
export function measurementSourceText(source) {
  return source === 'ocr' ? t('analysis.readByTheAiBecause') : t('analysis.typedByHand')
}
