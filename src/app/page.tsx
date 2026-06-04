import type { Metadata } from 'next'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Hero } from '@/components/home/Hero'
import { ActivityFeed } from '@/components/home/ActivityFeed'
import { SelectedWork } from '@/components/home/SelectedWork'
import { RecentPosts } from '@/components/home/RecentPosts'
import { getAllPosts } from '@/lib/mdx'
import { featuredProjects } from '@content/data/projects'

export const metadata: Metadata = {
  alternates: { canonical: 'https://souhardsingh.com' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Souhard Singh',
  url: 'https://souhardsingh.com',
  description:
    'Software engineer focused on backend systems and distributed infrastructure. Writing about engineering, travel, and the things in between.',
  jobTitle: 'Software Engineer',
  sameAs: [
    'https://github.com/souhardsingh',
    'https://twitter.com/souhardsingh',
    'https://linkedin.com/in/souhardsingh',
  ],
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
