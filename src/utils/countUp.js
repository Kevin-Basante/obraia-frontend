/** Fast at first and slow at the end, like something that settles in its place. */
export function easeOutCubic(progress) {
  return 1 - (1 - progress) ** 3
}

/** Value shown at `progress` (0 to 1) of the count, rounded to whole units. */
export function countUpValue(target, progress) {
  const clamped = Math.min(1, Math.max(0, progress))
  return Math.round(target * easeOutCubic(clamped))
}
