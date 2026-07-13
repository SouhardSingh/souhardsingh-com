import type { Metadata } from 'next'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Hero } from '@/components/home/Hero'
import { ActivityFeed } from '@/components/home/ActivityFeed'
import { SelectedWork } from '@/components/home/SelectedWork'
import { RecentPosts } from '@/components/home/RecentPosts'
import { getAllPosts } from '@/lib/content/mdx'
import { featuredProjects } from '@content/data/projects'
import { siteConfig } from '@/lib/site'

export const metadata: Metadata = {
  alternates: { canonical: '/' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteConfig.author.name,
  url: siteConfig.url,
  description: siteConfig.description,
  jobTitle: 'Software Engineer',
  sameAs: [siteConfig.social.github, siteConfig.social.twitter, siteConfig.social.linkedin],
}

export default function HomePage() {
  const posts = getAllPosts('blog').slice(0, 4)
  const latestPost = posts[0]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageWrapper>
        <Hero />
        <ActivityFeed latestPost={latestPost} featuredProject={featuredProjects[0]} />
        <SelectedWork projects={featuredProjects} />
        <RecentPosts posts={posts} />
      </PageWrapper>
    </>
  )
}
