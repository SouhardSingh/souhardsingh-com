import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/mdx'

const BASE = 'https://souhardsingh.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts('blog')

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE}/writing/blog/${post.slug}`,
    lastModified: post.updated ?? post.date,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/work`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/work/projects`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/writing`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/writing/blog`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/travel`, changeFrequency: 'monthly', priority: 0.7 },
    ...postUrls,
  ]
}
