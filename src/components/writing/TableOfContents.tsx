'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import type { TocHeading } from '@/types'

interface Props {
  headings: TocHeading[]
}

export function TableOfContents({ headings }: Props) {
  const [active, setActive] = useState<string>('')

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-20% 0% -70% 0%' }
    )

    headings.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length < 4) return null

  return (
    <nav
      aria-label="Table of contents"
      className="sticky top-24 hidden max-h-[calc(100vh-6rem)] overflow-y-auto lg:block"
    >
      <p className="text-text mb-3 text-xs font-semibold tracking-widest uppercase">On this page</p>
      <ul className="space-y-1.5 text-sm">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? '0.75rem' : '0' }}>
            <a
              href={`#${h.id}`}
              className={cn(
                'block leading-snug transition-colors',
                active === h.id ? 'text-accent font-medium' : 'text-text-muted hover:text-text'
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
