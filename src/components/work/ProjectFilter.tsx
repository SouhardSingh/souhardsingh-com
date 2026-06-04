'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ProjectCard } from './ProjectCard'
import type { Project } from '@/types'

const ALL_FILTERS = ['All', 'Web', 'Backend', 'Infrastructure', 'ML', 'Personal']

interface Props {
  projects: Project[]
}

export function ProjectFilter({ projects }: Props) {
  const [active, setActive] = useState('All')

  const filtered = active === 'All' ? projects : projects.filter((p) => p.tags.includes(active))

  return (
    <div>
      {/* Filter pills */}
      <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by tag">
        {ALL_FILTERS.map((filter) => (
          <button
            key={filter}
            onClick={() => setActive(filter)}
            className={cn(
              'min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-colors',
              active === filter
                ? 'bg-accent text-bg border-accent'
                : 'border-border text-text-muted hover:border-text-muted hover:text-text'
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => (
          <ProjectCard key={project.slug} project={project} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-text-muted py-16 text-center">No projects match this filter.</p>
      )}
    </div>
  )
}
