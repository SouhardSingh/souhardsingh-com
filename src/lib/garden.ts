import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const WIKI_LINK_RE = /\[\[([^\]]+)\]\]/g

export function getBacklinks(targetSlug: string): string[] {
  const dir = path.join(process.cwd(), 'content', 'garden')
  if (!fs.existsSync(dir)) return []
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))

  return files
    .filter((file) => {
      const slug = file.replace('.mdx', '')
      if (slug === targetSlug) return false
      const raw = fs.readFileSync(path.join(dir, file), 'utf8')
      const { content } = matter(raw)
      const links = [...content.matchAll(WIKI_LINK_RE)].map((m) => m[1])
      return links.includes(targetSlug)
    })
    .map((f) => f.replace('.mdx', ''))
}

export function getAllGardenLinks(): Record<string, string[]> {
  const dir = path.join(process.cwd(), 'content', 'garden')
  if (!fs.existsSync(dir)) return {}
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))
  const graph: Record<string, string[]> = {}

  files.forEach((file) => {
    const from = file.replace('.mdx', '')
    const raw = fs.readFileSync(path.join(dir, file), 'utf8')
    const { content } = matter(raw)
    const links = [...content.matchAll(WIKI_LINK_RE)].map((m) => m[1])
    graph[from] = links
  })

  return graph
}
