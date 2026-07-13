import type { Metadata } from 'next'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { ProjectFilter } from '@/components/work/ProjectFilter'
import { projects } from '@content/data/projects'
import { ogImageUrl } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Things I have built — web apps, backend systems, and side projects.',
  openGraph: {
    title: 'Projects',
    description: 'Things I have built — web apps, backend systems, and side projects.',
    images: [
      ogImageUrl(
        'Projects',
        'page',
        'Things I have built — web apps, backend systems, and side projects.'
      ),
    ],
  },
  twitter: { card: 'summary_large_image' },
}

export default function ProjectsPage() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h1 className="font-display text-text text-4xl font-bold tracking-tight sm:text-5xl">
          Projects
        </h1>
        <p className="text-text-muted mt-4 max-w-xl text-lg">
          Things I have built — web apps, backend systems, and side projects.
        </p>

        <div className="mt-12">
          <ProjectFilter projects={projects} />
        </div>
      </div>
    </PageWrapper>
  )
}
