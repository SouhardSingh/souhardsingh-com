import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Post, Project } from '@/types'
import destinations from '@content/travel/destinations.json'

interface Props {
  latestPost: Post | undefined
  featuredProject: Project | undefined
}

export function ActivityFeed({ latestPost, featuredProject }: Props) {
  const visitedCount = destinations.filter((d) => d.status === 'visited').length

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h2 className="text-text-muted mb-8 text-xs font-semibold tracking-widest uppercase">
        Latest
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Latest post */}
        {latestPost && (
          <Link href={`/writing/blog/${latestPost.slug}`} className="group block">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{latestPost.category}</Badge>
                  <span className="text-text-muted text-xs">
                    {new Date(latestPost.date).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                <CardTitle className="font-display mt-2 text-base leading-snug font-semibold">
                  {latestPost.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2">{latestPost.description}</CardDescription>
                <span className="text-accent mt-3 inline-flex items-center gap-1 text-sm font-medium">
                  Read <ArrowRightIcon size={14} />
                </span>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Featured project */}
        {featuredProject && (
          <Link href={`/work/projects`} className="group block">
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{featuredProject.tags[0]}</Badge>
                  <span className="text-text-muted text-xs">{featuredProject.year}</span>
                </div>
                <CardTitle className="font-display mt-2 text-base leading-snug font-semibold">
                  {featuredProject.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="line-clamp-2">
                  {featuredProject.description}
                </CardDescription>
                <span className="text-accent mt-3 inline-flex items-center gap-1 text-sm font-medium">
                  View <ArrowRightIcon size={14} />
                </span>
              </CardContent>
            </Card>
          </Link>
        )}

        {/* Travel teaser */}
        <Link href="/travel" className="group block">
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Travel</Badge>
              </div>
              <CardTitle className="font-display mt-2 text-base leading-snug font-semibold">
                Places visited
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text text-3xl font-bold">{visitedCount}</p>
              <CardDescription className="mt-1">countries explored so far</CardDescription>
              <span className="text-accent mt-3 inline-flex items-center gap-1 text-sm font-medium">
                See map <ArrowRightIcon size={14} />
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </section>
  )
}
