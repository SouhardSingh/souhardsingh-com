'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ExternalLinkIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { ExperienceItem as ExperienceItemType } from '@/types'

interface Props {
  item: ExperienceItemType
  index: number
}

export function ExperienceItem({ item, index }: Props) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className="relative pl-8"
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: reduced ? 0 : 0.4, delay: reduced ? 0 : index * 0.08 }}
    >
      {/* Timeline dot */}
      <span className="bg-accent absolute top-1.5 left-0 size-3 rounded-full" />
      {/* Timeline line (not on last item — handled by parent) */}
      <span className="bg-border absolute top-4 left-[5px] h-full w-px" aria-hidden />

      <div className="pb-10">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <h3 className="text-text text-base font-semibold">{item.role}</h3>
          <span className="text-text-muted text-sm">·</span>
          {item.link ? (
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-accent inline-flex items-center gap-0.5 text-sm transition-colors"
            >
              {item.company} <ExternalLinkIcon size={11} />
            </a>
          ) : (
            <span className="text-text-muted text-sm">{item.company}</span>
          )}
        </div>

        <p className="text-text-muted mt-0.5 text-xs font-medium tracking-wide">{item.period}</p>
        <p className="text-text-muted mt-2 text-sm leading-relaxed">{item.description}</p>

        {item.tech && item.tech.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.tech.map((t) => (
              <Badge key={t} variant="outline" className="text-xs">
                {t}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
