import { formatQuantity } from './format.js'
import { codeText, hasText, t } from '../i18n/i18n.js'

// Helpers for the risk assessments sent by the backend (score from 0 to 100).

/** 66.88 -> "66,9". */
export function formatScore(score) {
  return formatQuantity(Math.round(Number(score) * 10) / 10)
}

/** 0 -> "No delay expected", 12 -> "About 12 days of delay expected". */
export function delayText(days) {
  if (days <= 0) return t('risk.noDelayExpected')
  return t('risk.delay', { count: days })
}

/** Name of a rule of the assessment, such as "Late tasks", in the current language. */
export function factorLabel(factor) {
  return codeText('riskFactor', factor.code, factor.label)
}

/**
 * Sentence that explains a score, built from the code and the values the
 * backend sends. Without a known code it keeps the English sentence.
 */
export function riskDetailText(code, params, fallback) {
  if (code === 'late_tasks') {
    const tasks = t('riskDetail.late_tasks', { count: Number(params.count) })
    return `${tasks}; ${t('riskDetail.worst_task', { task: params.task, count: Number(params.days) })}`
  }
  return code && hasText(`riskDetail.${code}`) ? t(`riskDetail.${code}`, params) : fallback
}

/** The sentence of a factor of the assessment. */
export function factorDetail(factor) {
  return riskDetailText(factor.detailCode, factor.detailParams, factor.detail)
}

/** What started an assessment, from the code of its trigger. */
export function triggerText(code) {
  return codeText('riskTrigger', code)
}

/**
 * Places each point of the history in a chart of `width` × `height`: the
 * oldest on the left, score 100 at the top and 0 at the bottom. A single
 * point goes in the middle.
 */
export function chartPoints(history, width, height) {
  const step = history.length > 1 ? width / (history.length - 1) : 0
  return history.map((point, index) => ({
    ...point,
    x: history.length > 1 ? Math.round(index * step * 10) / 10 : width / 2,
    y: Math.round((height - (Number(point.score) / 100) * height) * 10) / 10,
  }))
}

/** The factors from the highest score to the lowest, so the main reason comes first. */
export function sortFactors(factors) {
  return [...factors].sort((a, b) => Number(b.score) - Number(a.score))
}
