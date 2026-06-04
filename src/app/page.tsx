import { PageWrapper } from '@/components/layout/PageWrapper'
import { Hero } from '@/components/home/Hero'
import { ActivityFeed } from '@/components/home/ActivityFeed'
import { getAllPosts } from '@/lib/mdx'
import { featuredProjects } from '@content/data/projects'

export default function HomePage() {
  const latestPost = getAllPosts('blog')[0]
  return (
    <PageWrapper>
      <Hero />
      <ActivityFeed latestPost={latestPost} featuredProject={featuredProjects[0]} />
    </PageWrapper>
  )
}
