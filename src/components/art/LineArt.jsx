import { MATERIAL_DRAWINGS, PHASE_DRAWINGS } from './drawings.js'
import './LineArt.css'

// Dashed lines and dots keep their real length, so their dash pattern stays the same.
const MEASURED = new Set(['dash', 'dot'])

const SHEETS = {
  phase: { drawings: PHASE_DRAWINGS, viewBox: '0 0 80 64', fallback: 'helmet' },
  material: { drawings: MATERIAL_DRAWINGS, viewBox: '0 0 64 64', fallback: 'crate' },
}

/**
 * A technical line drawing of a phase or a material. With `animated` the
 * strokes draw themselves one after the other. It is decorative, so screen
 * readers skip it.
 */
export function LineArt({ set, art, animated = false, className = '' }) {
  const sheet = SHEETS[set]
  const paths = sheet.drawings[art] ?? sheet.drawings[sheet.fallback]
  const classes = ['line-art', `line-art--${set}`, animated && 'line-art--animated', className]

  return (
    <svg viewBox={sheet.viewBox} className={classes.filter(Boolean).join(' ')} aria-hidden="true" focusable="false">
      {paths.map((path, index) => (
        <path
          key={`${path.kind}-${index}`}
          d={path.d}
          pathLength={MEASURED.has(path.kind) ? undefined : 1}
          className={`line-art__${path.kind}`}
          style={{ '--stroke': index }}
        />
      ))}
    </svg>
  )
}
