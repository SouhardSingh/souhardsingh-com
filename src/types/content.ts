export type PostCategory = 'engineering' | 'travel' | 'life' | 'culture' | 'building'
export type GardenStage = 'seed' | 'growing' | 'evergreen'

export interface Post {
  slug: string
  title: string
  description: string
  date: string
  updated?: string
  category: PostCategory
  tags: string[]
  stage?: GardenStage
  coverImage?: string
  readingTime: number
  featured?: boolean
  published: boolean
}

export interface TocHeading {
  id: string
  text: string
  level: number
}
