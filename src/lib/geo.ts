import type { LatLng } from '@/types'

const EARTH_RADIUS_KM = 6371

/** Great-circle distance between two lat/lng points, in kilometers. */
export function haversineKm(a: LatLng, b: LatLng): number {
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

/** Map a guess distance to a 0–5000 score with a smooth exponential falloff. */
export function scoreFromDistanceKm(km: number): number {
  return Math.round(5000 * Math.exp(-km / 2000))
}
