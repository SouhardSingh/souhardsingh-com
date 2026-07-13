export interface LatLng {
  lat: number
  lng: number
}

export interface GeoRound {
  id: string
  /** Path under /public, e.g. /play/rounds/sahara.jpg. Optional — falls back to the hint. */
  image?: string
  answer: LatLng & { name: string; country: string }
  hint: string
}

export interface GuessResult {
  round: GeoRound
  guess: LatLng
  distanceKm: number
  points: number
}
