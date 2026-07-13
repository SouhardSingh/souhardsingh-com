import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { ReadingProgress } from '@/components/writing/ReadingProgress'
import { TableOfContents } from '@/components/writing/TableOfContents'
import { mdxComponents } from '@/components/writing/MDXComponents'
import { getAllPosts, getPostBySlug, mdxOptions } from '@/lib/content/mdx'
import { ogImageUrl } from '@/lib/site'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

export async function generateStaticParams() {
  return getAllPosts('blog').map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const { frontmatter } = await getPostBySlug('blog', slug)
    return {
      title: frontmatter.title,
      description: frontmatter.description,
      openGraph: {
        type: 'article',
        title: frontmatter.title,
        description: frontmatter.description,
        publishedTime: frontmatter.date,
        modifiedTime: frontmatter.updated ?? frontmatter.date,
        images: [ogImageUrl(frontmatter.title, 'blog', frontmatter.description)],
      },
      twitter: { card: 'summary_large_image' },
    }
  } catch {
    return {}
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  let frontmatter, source, headings
  try {
    ;({ frontmatter, source, headings } = await getPostBySlug('blog', slug))
  } catch {
    notFound()
  }

  return (
    <PageWrapper>
      <ReadingProgress />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-16">
          <article className="min-w-0">
            <Link
              href="/writing/blog"
              className="text-text-muted hover:text-text mb-8 inline-flex items-center gap-1 text-sm transition-colors"
            >
              ← Writing
            </Link>

            <header className="mb-10">
              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
                <Badge variant="secondary" className="capitalize">
                  {frontmatter.category}
                </Badge>
                <span className="text-text-muted">
                  {new Date(frontmatter.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
                <span className="text-text-muted">·</span>
                <span className="text-text-muted">{frontmatter.readingTime} min read</span>
              </div>

              <h1 className="font-display text-text text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
                {frontmatter.title}
              </h1>
              <p className="text-text-muted mt-3 text-lg">{frontmatter.description}</p>

              {frontmatter.tags?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {frontmatter.tags.map((tag: string) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </header>

            <div className="prose prose-neutral dark:prose-invert max-w-none md:max-w-[68ch]">
              <MDXRemote
                source={source}
                components={mdxComponents}
                options={mdxOptions as Parameters<typeof MDXRemote>[0]['options']}
              />
            </div>

            <div id="comments" className="mt-16" />
          </article>

          <aside className="hidden lg:block">
            <TableOfContents headings={headings ?? []} />
          </aside>
        </div>
      </div>
    </PageWrapper>
  )
}
