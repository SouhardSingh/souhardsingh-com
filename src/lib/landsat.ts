// R2 key pattern: landsat/letters/{CHAR}/{index}.jpg  (0-indexed)
// Update LETTER_VARIANTS counts as images are uploaded to R2.
export const LETTER_VARIANTS: Record<string, number> = {
  A: 1,
  B: 1,
  C: 1,
  D: 1,
  E: 1,
  F: 1,
  G: 1,
  H: 1,
  I: 1,
  J: 1,
  K: 1,
  L: 1,
  M: 1,
  N: 1,
  O: 1,
  P: 1,
  Q: 1,
  R: 1,
  S: 1,
  T: 1,
  U: 1,
  V: 1,
  W: 1,
  X: 1,
  Y: 1,
  Z: 1,
}

export const SUPPORTED_CHARS = new Set(Object.keys(LETTER_VARIANTS))

export interface LetterMeta {
  location: string
  lat: number
  lon: number
  sensor: string
}

// Keyed by "{CHAR}/{index}", e.g. "A/0".
// Populate as images are added to R2.
export const LETTER_META: Record<string, LetterMeta> = {
  // 'A/0': { location: 'Atacama Desert, Chile', lat: -23.8, lon: -69.3, sensor: 'Landsat 9' },
}

export function getRandomLetterKey(char: string): string | null {
  const upper = char.toUpperCase()
  const count = LETTER_VARIANTS[upper] ?? 0
  if (count === 0) return null
  const idx = Math.floor(Math.random() * count)
  return `landsat/letters/${upper}/${idx}.jpg`
}

export function getLetterMeta(char: string, index: number): LetterMeta | null {
  return LETTER_META[`${char.toUpperCase()}/${index}`] ?? null
}
