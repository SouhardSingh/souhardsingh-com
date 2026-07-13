import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/content/mdx'
import { absoluteUrl } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts('blog')

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: absoluteUrl(`/writing/blog/${post.slug}`),
    lastModified: post.updated ?? post.date,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    { url: absoluteUrl('/'), lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: absoluteUrl('/about'), changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/work'), changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/work/projects'), changeFrequency: 'monthly', priority: 0.8 },
    { url: absoluteUrl('/writing'), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/writing/blog'), changeFrequency: 'weekly', priority: 0.9 },
    { url: absoluteUrl('/travel'), changeFrequency: 'monthly', priority: 0.7 },
    { url: absoluteUrl('/play'), changeFrequency: 'monthly', priority: 0.5 },
    ...postUrls,
  ]
}
