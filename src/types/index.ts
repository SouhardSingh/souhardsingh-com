// ── Post (shared by blog, garden, building, architecture) ──────────────
export type PostCategory = 'engineering' | 'travel' | 'life' | 'culture' | 'building'
export type GardenStage = 'seed' | 'growing' | 'evergreen'

export interface Post {
  slug: string
  title: string
  description: string
  date: string // ISO 8601
  updated?: string
  category: PostCategory
  tags: string[]
  stage?: GardenStage // garden only
  coverImage?: string
  readingTime: number // minutes, auto-computed
  featured?: boolean
  published: boolean
}

// ── Project ─────────────────────────────────────────────────────────────
export type ProjectStatus = 'active' | 'complete' | 'archived' | 'wip'

export interface Project {
  slug: string
  title: string
  description: string
  longDescription?: string
  status: ProjectStatus
  year: number
  tags: string[]
  tech: string[]
  links: {
    github?: string
    live?: string
    demo?: string
    writeup?: string
  }
  featured: boolean
  coverImage?: string
  architectureWriteup?: string // slug in /work/architecture
}

// ── Destination ──────────────────────────────────────────────────────────
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
  coordinates: [number, number] // [longitude, latitude]
  status: 'visited' | 'wishlist'
  visitedDates?: string[]
  coverImage?: string
  photos?: string[]
  recommendations?: Recommendation[]
  journalSlug?: string
}

// ── Media shelf ──────────────────────────────────────────────────────────
export type ReadStatus = 'read' | 'reading' | 'want'
export type WatchStatus = 'watched' | 'watching' | 'want'
export type Rating = 1 | 2 | 3 | 4 | 5

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

// ── Guestbook ────────────────────────────────────────────────────────────
export interface GuestbookEntry {
  id: string
  name: string
  username: string
  avatar: string
  message: string
  createdAt: string
}

// ── Experience ───────────────────────────────────────────────────────────
export interface ExperienceItem {
  company: string
  role: string
  period: string
  description: string
  tech?: string[]
  link?: string
}
