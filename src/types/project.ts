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
  architectureWriteup?: string
}
