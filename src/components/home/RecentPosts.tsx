import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Post } from '@/types'

interface Props {
  posts: Post[]
}

export function RecentPosts({ posts }: Props) {
  if (posts.length === 0) return null

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-text-muted text-xs font-semibold tracking-widest uppercase">
          Recent Writing
        </h2>
        <Link
          href="/writing/blog"
          className="text-accent hover:text-accent-hover inline-flex items-center gap-1 text-sm font-medium transition-colors"
        >
          All posts <ArrowRightIcon size={14} />
        </Link>
      </div>

      <ul className="divide-border divide-y">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/writing/blog/${post.slug}`}
              className="group flex items-start justify-between gap-6 py-5"
            >
              <div className="min-w-0 flex-1">
                <p className="text-text group-hover:text-accent leading-snug font-medium transition-colors">
                  {post.title}
                </p>
                <p className="text-text-muted mt-1 line-clamp-1 text-sm">{post.description}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span className="text-text-muted text-xs whitespace-nowrap">
                  {new Date(post.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <Badge variant="secondary" className="text-xs capitalize">
                  {post.category}
                </Badge>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
