/**
 * Single source of truth for the Landsat letter tiles.
 *
 * R2 key pattern: `landsat/letters/{CHAR}/{file}.{ext}` — `file` is the object's
 * real, human-readable basename, so uploads are never tied to an index. Rename or
 * reorder freely; only the `file` value has to match the object in the bucket.
 *
 * To add a variant, push another entry onto the letter's array. To add a letter,
 * add the key — supported characters are derived from this object, never listed twice.
 */

export interface LandsatTile {
  /** Exact R2 object basename, without extension (e.g. 'atacama-desert'). */
  file: string
  location: string
  lat: number
  lon: number
  sensor: string
  /** Defaults to 'jpg'. Set when an object uses a different extension. */
  ext?: string
}

/** Metadata shape sent to the client — the tile minus its storage details. */
export type LetterMeta = Pick<LandsatTile, 'location' | 'lat' | 'lon' | 'sensor'>

const DEFAULT_EXT = 'jpg'

export const LANDSAT_LETTERS: Record<string, LandsatTile[]> = {
  A: [
    {
      file: 'atacama-desert',
      location: 'Atacama Desert, Chile',
      lat: -23.8,
      lon: -69.3,
      sensor: 'Landsat 9',
    },
  ],
  B: [
    {
      file: 'lake-baikal',
      location: 'Lake Baikal, Russia',
      lat: 53.5,
      lon: 108.2,
      sensor: 'Landsat 8',
    },
  ],
  C: [{ file: 'cape-cod', location: 'Cape Cod, USA', lat: 41.85, lon: -70.0, sensor: 'Landsat 9' }],
  D: [
    {
      file: 'danube-delta',
      location: 'Danube Delta, Romania',
      lat: 45.15,
      lon: 29.5,
      sensor: 'Landsat 8',
    },
  ],
  E: [
    { file: 'everglades', location: 'Everglades, USA', lat: 25.8, lon: -80.9, sensor: 'Landsat 9' },
  ],
  F: [
    {
      file: 'fraser-river',
      location: 'Fraser River, Canada',
      lat: 49.2,
      lon: -123.0,
      sensor: 'Landsat 8',
    },
  ],
  G: [
    {
      file: 'ganges-delta',
      location: 'Ganges Delta, Bangladesh',
      lat: 22.5,
      lon: 89.5,
      sensor: 'Landsat 9',
    },
  ],
  H: [
    { file: 'himalayas', location: 'Himalayas, Nepal', lat: 28.0, lon: 86.9, sensor: 'Landsat 8' },
  ],
  I: [
    {
      file: 'iceland-highlands',
      location: 'Highlands, Iceland',
      lat: 64.9,
      lon: -18.6,
      sensor: 'Landsat 9',
    },
  ],
  J: [
    {
      file: 'jordan-rift-valley',
      location: 'Jordan Rift Valley',
      lat: 31.5,
      lon: 35.5,
      sensor: 'Landsat 8',
    },
  ],
  K: [
    {
      file: 'kamchatka',
      location: 'Kamchatka Peninsula, Russia',
      lat: 56.0,
      lon: 159.5,
      sensor: 'Landsat 9',
    },
  ],
  L: [
    {
      file: 'lena-delta',
      location: 'Lena Delta, Russia',
      lat: 72.5,
      lon: 126.5,
      sensor: 'Landsat 8',
    },
  ],
  M: [
    {
      file: 'mississippi-river',
      location: 'Mississippi River, USA',
      lat: 29.9,
      lon: -89.3,
      sensor: 'Landsat 9',
    },
  ],
  N: [
    {
      file: 'namib-desert',
      location: 'Namib Desert, Namibia',
      lat: -24.7,
      lon: 15.3,
      sensor: 'Landsat 8',
    },
  ],
  O: [
    {
      file: 'okavango-delta',
      location: 'Okavango Delta, Botswana',
      lat: -19.3,
      lon: 22.9,
      sensor: 'Landsat 9',
    },
  ],
  P: [
    {
      file: 'pamir-mountains',
      location: 'Pamir Mountains, Tajikistan',
      lat: 38.5,
      lon: 73.0,
      sensor: 'Landsat 8',
    },
  ],
  Q: [
    {
      file: 'qattara-depression',
      location: 'Qattara Depression, Egypt',
      lat: 29.9,
      lon: 27.0,
      sensor: 'Landsat 9',
    },
  ],
  R: [
    {
      file: 'rub-al-khali',
      location: "Rub' al Khali, Saudi Arabia",
      lat: 20.0,
      lon: 50.0,
      sensor: 'Landsat 8',
    },
  ],
  S: [
    {
      file: 'sahara-desert',
      location: 'Sahara Desert, Algeria',
      lat: 26.0,
      lon: 2.0,
      sensor: 'Landsat 9',
    },
  ],
  T: [
    {
      file: 'tibetan-plateau',
      location: 'Tibetan Plateau, China',
      lat: 33.0,
      lon: 88.0,
      sensor: 'Landsat 8',
    },
  ],
  U: [
    {
      file: 'ural-mountains',
      location: 'Ural Mountains, Russia',
      lat: 60.0,
      lon: 59.0,
      sensor: 'Landsat 9',
    },
  ],
  V: [
    {
      file: 'volga-delta',
      location: 'Volga Delta, Russia',
      lat: 46.0,
      lon: 48.5,
      sensor: 'Landsat 8',
    },
  ],
  W: [
    {
      file: 'wadi-hadhramaut',
      location: 'Wadi Hadhramaut, Yemen',
      lat: 15.9,
      lon: 48.8,
      sensor: 'Landsat 9',
    },
  ],
  X: [
    {
      file: 'xingu-river',
      location: 'Xingu River, Brazil',
      lat: -3.2,
      lon: -52.3,
      sensor: 'Landsat 8',
    },
  ],
  Y: [
    {
      file: 'yukon-delta',
      location: 'Yukon Delta, Alaska',
      lat: 62.5,
      lon: -164.5,
      sensor: 'Landsat 9',
    },
  ],
  Z: [
    {
      file: 'zagros-mountains',
      location: 'Zagros Mountains, Iran',
      lat: 32.0,
      lon: 50.0,
      sensor: 'Landsat 8',
    },
  ],
}

/** Full R2 object key for a tile. */
export function tileKey(char: string, tile: LandsatTile): string {
  return `landsat/letters/${char.toUpperCase()}/${tile.file}.${tile.ext ?? DEFAULT_EXT}`
}

/** Strip storage details, leaving only what the client needs. */
export function tileMeta({ location, lat, lon, sensor }: LandsatTile): LetterMeta {
  return { location, lat, lon, sensor }
}

/** Pick a random tile for a character, or null when none exist. */
export function getRandomTile(char: string): LandsatTile | null {
  const tiles = LANDSAT_LETTERS[char.toUpperCase()]
  if (!tiles?.length) return null
  return tiles[Math.floor(Math.random() * tiles.length)]
}
