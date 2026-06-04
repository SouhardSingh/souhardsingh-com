import Link from 'next/link'
import { ArrowRightIcon } from 'lucide-react'
import { ProjectCard } from '@/components/work/ProjectCard'
import type { Project } from '@/types'

interface Props {
  projects: Project[]
}

export function SelectedWork({ projects }: Props) {
  if (projects.length === 0) return null

  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-text-muted text-xs font-semibold tracking-widest uppercase">
          Selected Work
        </h2>
        <Link
          href="/work/projects"
          className="text-accent hover:text-accent-hover inline-flex items-center gap-1 text-sm font-medium transition-colors"
        >
          All projects <ArrowRightIcon size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {projects.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}
