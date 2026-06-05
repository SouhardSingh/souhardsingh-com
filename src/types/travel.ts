export interface Recommendation {
  name: string
  type: 'food' | 'stay' | 'see' | 'do'
  note: string
}

export interface Destination {
  slug: string
  name: string
  country: string
  continent: string
  coordinates: [number, number]
  status: 'visited' | 'wishlist'
  visitedDates?: string[]
  coverImage?: string
  photos?: string[]
  recommendations?: Recommendation[]
  journalSlug?: string
}
