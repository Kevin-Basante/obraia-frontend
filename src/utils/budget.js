import { formatPercent } from './format.js'

// Helpers for the quotation and the budget versions. Amounts come from the
// backend as numbers in COP; percentages come from 0 to 100.

/** Errors that mean the project has nothing to quote yet, so the page shows a hint instead. */
const NOTHING_TO_QUOTE = ['NO_MEASUREMENTS', 'NO_MATERIAL_FORMULAS']

export function isNothingToQuote(error) {
  return NOTHING_TO_QUOTE.includes(error?.code)
}

/** 3 -> "3%". Rows with a fixed amount have no rate, so they show nothing. */
export function formatRate(percentage) {
  return percentage === null || percentage === undefined ? '' : formatPercent(Number(percentage) / 100)
}

/** Share of one row in the total, as a fraction for formatPercent. */
export function shareOfTotal(amount, total) {
  return Number(total) > 0 ? Number(amount) / Number(total) : 0
}

/** Where the working days of the labor come from, in words. */
export function daysSourceText(source) {
  return source === 'phases'
    ? 'counted between the dates of the phases of the plan'
    : 'from the standard phases of the project type, because the plan has no dates yet'
}

/** The approved version, or undefined while none is approved. */
export function approvedVersion(versions) {
  return versions.find((version) => version.status.code === 'approved')
}

/** Sum of the subtotals of a list of materials. */
export function materialsTotal(materials) {
  return materials.reduce((total, material) => total + Number(material.subtotal), 0)
}
