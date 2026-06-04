import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { CategoryFilter } from '@/components/writing/CategoryFilter'
import { PostCard } from '@/components/writing/PostCard'
import { getAllPosts } from '@/lib/mdx'
import type { PostCategory } from '@/types'

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Writing on engineering, travel, and the things in between.',
  openGraph: {
    title: 'Blog',
    description: 'Writing on engineering, travel, and the things in between.',
    images: ['/og?title=Blog&type=page'],
  },
  twitter: { card: 'summary_large_image' },
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const { cat } = await searchParams
  const allPosts = getAllPosts('blog')
  const posts = cat ? allPosts.filter((p) => p.category === (cat as PostCategory)) : allPosts

  return (
    <PageWrapper>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-text text-4xl font-bold tracking-tight sm:text-5xl">
          Writing
        </h1>
        <p className="text-text-muted mt-4 text-lg">
          Engineering, travel, and the things in between.
        </p>

        <div className="mt-10">
          <Suspense>
            <CategoryFilter />
          </Suspense>
        </div>

        <div className="mt-8 space-y-4">
          {posts.length > 0 ? (
            posts.map((post) => <PostCard key={post.slug} post={post} />)
          ) : (
            <p className="text-text-muted py-12 text-center">No posts yet.</p>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
