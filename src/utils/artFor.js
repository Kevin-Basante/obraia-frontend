/**
 * Picks the drawing for a phase or a material from its name. Names come from
 * the database in Spanish, so the keywords are Spanish too; accents and case
 * are ignored.
 */
export function normalize(text) {
  return (text ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
}

const PHASE_KEYWORDS = [
  ['survey', ['replanteo', 'preliminar']],
  ['excavation', ['excavacion', 'movimiento de tierra']],
  ['foundation', ['cimentacion', 'zapata']],
  ['structure', ['estructura', 'columna', 'viga']],
  ['masonry', ['mamposteria', 'muro']],
  ['roof', ['cubierta', 'techo']],
  ['installations', ['instalacion', 'hidrosanitari', 'electric']],
  ['finishes', ['acabado', 'panete', 'piso', 'pintura']],
]

/** Drawing for a construction phase, or a hard hat when no keyword matches. */
export function phaseArt(name) {
  const text = normalize(name)
  const match = PHASE_KEYWORDS.find(([, words]) => words.some((word) => text.includes(word)))
  return match ? match[0] : 'helmet'
}

// The first matching keyword wins, so "Arena de río (concreto)" is sand and
// "Teja de fibrocemento" is a roof sheet, not cement.
const MATERIAL_KEYWORDS = [
  ['sand', ['arena']],
  ['gravel', ['gravilla', 'grava', 'triturado']],
  ['rebar', ['varilla']],
  ['wire', ['alambre']],
  ['sheet', ['teja']],
  ['cement', ['cemento', 'concreto', 'mortero']],
  ['block', ['bloque', 'ladrillo']],
  ['paint', ['pintura', 'vinilo', 'estuco']],
]

const CATEGORY_ART = {
  aggregates: 'sand',
  cement_concrete: 'cement',
  finishes: 'paint',
  masonry: 'block',
  roofing: 'sheet',
  steel: 'rebar',
}

/** Drawing for a material: by its name first, then by its category, else a crate. */
export function materialArt(material) {
  const text = normalize(material?.name)
  const match = MATERIAL_KEYWORDS.find(([, words]) => words.some((word) => text.includes(word)))
  if (match) return match[0]
  return CATEGORY_ART[material?.category?.code] ?? 'crate'
}
