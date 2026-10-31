// Helpers for reading blueprints with the AI (POST .../blueprints/{id}/analyze).

/** Errors of the AI, explained for the user. The limit error already says when to try again. */
const AI_ERRORS = {
  AI_SERVICE_DISABLED: 'The AI service is not configured on the server yet.',
  AI_SERVICE_FAILED: 'The AI could not read the blueprint. Wait a moment and try again.',
}

export function analysisErrorMessage(error) {
  if (!error) return ''
  return AI_ERRORS[error.code] ?? error.message
}

/** Text of the button: a blueprint already read can be read again. */
export function analyzeLabel(blueprint) {
  return blueprint.processingStatus.code === 'completed' ? 'Analyze again' : 'Analyze with AI'
}

function plural(count, word) {
  return `${count} ${word}${count === 1 ? '' : 's'}`
}

/** One sentence about the result: what was saved, what was left out and whether the cache answered. */
export function analysisSummary(result) {
  let text = `The AI found ${plural(result.measurements.length, 'measurement')}`
  if (result.discarded > 0) text += ` and left out ${result.discarded} it could not use`
  text += '.'
  if (result.cached) text += ' This file was already read, so the AI was not called again.'
  return text
}

/** Where the measurements of the quotation come from, in words. */
export function measurementSourceText(source) {
  return source === 'ocr'
    ? 'read by the AI, because there are no manual measurements'
    : 'typed by hand'
}
