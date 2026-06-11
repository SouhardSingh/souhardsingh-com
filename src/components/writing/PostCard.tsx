import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { Post } from '@/types'

interface Props {
  post: Post
}

export function PostCard({ post }: Props) {
  return (
    <Link
      href={`/writing/blog/${post.slug}`}
      className="group border-border hover:bg-surface block rounded-xl border p-5 transition-colors sm:p-6"
    >
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <Badge variant="secondary">{post.category}</Badge>
        <span className="text-text-muted">
          {new Date(post.date).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          })}
        </span>
        <span className="text-text-muted">·</span>
        <span className="text-text-muted">{post.readingTime} min read</span>
      </div>

      <h2 className="font-display text-text mt-3 text-xl leading-snug font-semibold sm:text-2xl">
        {post.title}
      </h2>

      <p className="text-text-muted mt-2 line-clamp-2 text-sm leading-relaxed">
        {post.description}
      </p>

      {post.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </Link>
  )
}
