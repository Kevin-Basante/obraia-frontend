/*
 * Line drawings in the style of a construction sheet. Each drawing is a list
 * of paths; `kind` picks the pen:
 *   line   main outline (ink)        accent  highlight (brick red)
 *   fill   outlined shape on sand    clay    outlined shape on soft brick
 *   thin   hatch and ground marks    dash    string lines and axes
 *   dot    round points (sand, gravel)
 * Phases are drawn on an 80 x 64 sheet.
 */

// Short diagonal strokes under a ground line, like soil in a section drawing.
function soilHatch(fromX, toX, y, step = 8) {
  let d = ''
  for (let x = fromX; x <= toX; x += step) d += `M${x} ${y + 7}l5 -5`
  return d
}

// Bricks in running bond: rows of 16 x 7, every other row shifted half a brick.
function brickRows(left, right, bottom, rows) {
  let d = ''
  for (let row = 0; row < rows; row += 1) {
    const y = bottom - row * 7
    d += `M${left} ${y - 7}H${right}`
    const offset = row % 2 === 0 ? 0 : 8
    for (let x = left + 16 - offset; x < right; x += 16) d += `M${x} ${y}v-7`
  }
  return d
}

export const PHASE_DRAWINGS = {
  survey: [
    { kind: 'thin', d: `M4 54H76${soilHatch(6, 72, 54)}` },
    { kind: 'line', d: 'M20 54 29 31M38 54 31 31M30 54V32' },
    { kind: 'fill', d: 'M23 19h14v11H23z' },
    { kind: 'line', d: 'M37 23h6M28 19v-3h4v3' },
    { kind: 'accent', d: 'M54 54V40M70 54V40' },
    { kind: 'dash', d: 'M43 23 54 42M54 42H70' },
    { kind: 'accent', d: 'M52 40h4M68 40h4' },
  ],
  excavation: [
    { kind: 'fill', d: 'M4 30H22l7 20H51l7-20H76V58H4z' },
    { kind: 'thin', d: `${soilHatch(6, 18, 34)}${soilHatch(62, 72, 34)}${soilHatch(30, 46, 47, 8)}` },
    { kind: 'clay', d: 'M60 30q7-12 15 0z' },
    { kind: 'dot', d: 'M64 26h.01M69 24h.01M71 28h.01' },
    { kind: 'line', d: 'M33 8l9 30' },
    { kind: 'accent', d: 'M30 8h7' },
    { kind: 'fill', d: 'M38 36l9-3 4 9-8 4z' },
    { kind: 'dash', d: 'M22 26V20M51 26V20M22 22H51' },
  ],
  foundation: [
    { kind: 'thin', d: `M4 24H76${soilHatch(6, 12, 24, 6)}${soilHatch(66, 72, 24, 6)}${soilHatch(8, 14, 40, 6)}${soilHatch(66, 72, 40, 6)}` },
    { kind: 'fill', d: 'M16 40h48v13H16zM34 12h12v28H34z' },
    { kind: 'accent', d: 'M20 49H60M37 14V49M43 14V49M37 49l-4-4M43 49l4-4' },
    { kind: 'thin', d: 'M37 22h6M37 30h6M37 38h6' },
    { kind: 'dash', d: 'M40 6V58' },
  ],
  structure: [
    { kind: 'thin', d: `M4 56H76${soilHatch(6, 72, 56)}` },
    { kind: 'fill', d: 'M12 12h56v5H12zM12 33h56v5H12z' },
    { kind: 'fill', d: 'M14 17h6v16h-6zM37 17h6v16h-6zM60 17h6v16h-6zM14 38h6v18h-6zM37 38h6v18h-6zM60 38h6v18h-6z' },
    { kind: 'accent', d: 'M17 6H63M17 3v6M63 3v6M40 3v6' },
    { kind: 'dash', d: 'M17 12V56M40 12V56M63 12V56' },
  ],
  masonry: [
    { kind: 'thin', d: `M4 56H76${soilHatch(6, 72, 56)}` },
    { kind: 'fill', d: 'M8 56V21H56V56z' },
    { kind: 'thin', d: brickRows(8, 56, 56, 5) },
    { kind: 'clay', d: 'M60 49h16v7H60z' },
    { kind: 'line', d: 'M58 30l10-6 6 2-10 6zM68 24l5-8' },
    { kind: 'accent', d: 'M8 14H56M8 11v6M56 11v6' },
  ],
  roof: [
    { kind: 'thin', d: `M4 56H76${soilHatch(6, 72, 56)}` },
    { kind: 'fill', d: 'M16 56V32H64V56z' },
    { kind: 'line', d: 'M34 56V42h12v14' },
    { kind: 'clay', d: 'M8 34L40 10 72 34 68 37 40 16 12 37z' },
    { kind: 'line', d: 'M40 16V32M40 32 28 25M40 32 52 25M16 32H64' },
    { kind: 'accent', d: 'M40 4V8' },
  ],
  installations: [
    { kind: 'thin', d: `M4 56H76${soilHatch(6, 72, 56)}` },
    { kind: 'line', d: 'M8 44H28q6 0 6-6V12' },
    { kind: 'line', d: 'M8 49H28q11 0 11-11V12' },
    { kind: 'fill', d: 'M15 41h6v11h-6zM18 41v-5M14 36h8' },
    { kind: 'accent', d: 'M52 56V20H72' },
    { kind: 'fill', d: 'M47 36h10v12H47z' },
    { kind: 'accent', d: 'M64 26l-5 9h7l-5 9' },
  ],
  finishes: [
    { kind: 'fill', d: 'M4 56 16 40H64L76 56z' },
    { kind: 'thin', d: 'M28 40 24 56M40 40V56M52 40l4 16M10 48H70' },
    { kind: 'line', d: 'M8 40V8M72 40V8' },
    { kind: 'accent', d: 'M12 14H34M12 20H34M12 26H30' },
    { kind: 'clay', d: 'M40 10h22v7H40z' },
    { kind: 'line', d: 'M51 17v5h-8v12' },
  ],
  helmet: [
    { kind: 'fill', d: 'M16 42q0-24 24-24t24 24z' },
    { kind: 'line', d: 'M10 42H70v5H10zM36 18V12h8v6' },
    { kind: 'accent', d: 'M30 22v14M50 22v14' },
  ],
}
