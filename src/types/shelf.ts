export type Rating = 1 | 2 | 3 | 4 | 5
export type ReadStatus = 'read' | 'reading' | 'want'
export type WatchStatus = 'watched' | 'watching' | 'want'

interface MediaBase {
  title: string
  year: number
  rating?: Rating
  note?: string
}

export interface Book extends MediaBase {
  author: string
  status: ReadStatus
  dateRead?: string
  cover?: string
}

export interface Film extends MediaBase {
  director: string
  status: WatchStatus
  dateWatched?: string
}
