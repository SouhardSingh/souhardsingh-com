'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLinkIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Project } from '@/types'

interface Props {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: Props) {
  const reduced = useReducedMotion()
  const visibleTech = project.tech.slice(0, 4)
  const overflow = project.tech.length - visibleTech.length

  return (
    <motion.div
      initial={reduced ? {} : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      whileHover={reduced ? {} : { y: -3 }}
    >
      <Card className="group/card h-full overflow-hidden transition-shadow hover:shadow-lg">
        {project.coverImage && (
          <div className="relative aspect-video w-full overflow-hidden">
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 group-hover/card:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            />
          </div>
        )}

        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="font-display text-base font-semibold">{project.title}</CardTitle>
            <Badge variant="outline" className="shrink-0 text-xs">
              {project.year}
            </Badge>
          </div>
          <CardDescription className="line-clamp-2 text-sm">{project.description}</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-3">
          {visibleTech.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {visibleTech.map((t) => (
                <Badge key={t} variant="secondary" className="text-xs">
                  {t}
                </Badge>
              ))}
              {overflow > 0 && (
                <Badge variant="outline" className="text-xs">
                  +{overflow} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center gap-3">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} on GitHub`}
                className="text-text-muted hover:text-text transition-colors"
              >
                <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
            )}
            {project.links.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} live site`}
                className="text-text-muted hover:text-text transition-colors"
              >
                <ExternalLinkIcon size={16} />
              </a>
            )}
            {project.architectureWriteup && (
              <Link
                href={`/work/architecture/${project.architectureWriteup}`}
                className="text-accent hover:text-accent-hover ml-auto text-xs font-medium transition-colors"
              >
                Architecture →
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
