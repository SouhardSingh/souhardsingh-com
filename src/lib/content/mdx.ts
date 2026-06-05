import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'
import GithubSlugger from 'github-slugger'
import type { Heading } from 'mdast'
import type { Post, TocHeading } from '@/types'

const CONTENT_ROOT = path.join(process.cwd(), 'content')

export type ContentType = 'blog' | 'garden' | 'building' | 'architecture' | 'travel/journal'

export { type TocHeading }

export function getAllPosts(type: ContentType): Post[] {
  const dir = path.join(CONTENT_ROOT, type)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx'))
    .map((filename) => {
      const slug = filename.replace('.mdx', '')
      const raw = fs.readFileSync(path.join(dir, filename), 'utf8')
      const { data, content } = matter(raw)
      return {
        slug,
        ...data,
        readingTime: Math.ceil(readingTime(content).minutes),
      } as Post
    })
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function extractHeadings(content: string): TocHeading[] {
  const tree = unified().use(remarkParse).parse(content)
  const slugger = new GithubSlugger()
  const headings: TocHeading[] = []

  visit(tree, 'heading', (node: Heading) => {
    if (node.depth < 2 || node.depth > 3) return

    const text = node.children
      .map((child) => ('value' in child ? String(child.value) : ''))
      .join('')

    headings.push({ id: slugger.slug(text), text, level: node.depth })
  })

  return headings
}

export async function getPostBySlug(type: ContentType, slug: string) {
  const filepath = path.join(CONTENT_ROOT, type, `${slug}.mdx`)
  const raw = fs.readFileSync(filepath, 'utf8')
  const { data, content } = matter(raw)
  return {
    frontmatter: {
      ...data,
      readingTime: Math.ceil(readingTime(content).minutes),
    } as Post,
    source: content,
    headings: extractHeadings(content),
  }
}

export const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      [
        rehypePrettyCode,
        {
          theme: { dark: 'github-dark', light: 'github-light' },
          keepBackground: false,
        },
      ],
    ],
  },
}
