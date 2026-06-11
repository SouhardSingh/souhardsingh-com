'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDownIcon, MapPinIcon } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import type { Destination, Recommendation } from '@/types'

const TYPE_ICON: Record<Recommendation['type'], string> = {
  food: '🍜',
  stay: '🏠',
  see: '👁',
  do: '⚡',
}

const TYPE_LABEL: Record<Recommendation['type'], string> = {
  food: 'Eat',
  stay: 'Stay',
  see: 'See',
  do: 'Do',
}

function formatVisitDate(iso: string) {
  const [year, month] = iso.split('-')
  if (!month) return year
  return new Date(`${year}-${month}-01`).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}

interface Props {
  destination: Destination
  mode?: 'visited' | 'wishlist'
}

export function DestinationCard({ destination: d, mode = 'visited' }: Props) {
  const [open, setOpen] = useState(false)
  const hasRecs = (d.recommendations?.length ?? 0) > 0

  if (mode === 'wishlist') {
    return (
      <div className="border-border bg-surface-2/50 flex items-start gap-3 rounded-xl border p-4">
        <MapPinIcon
          size={15}
          className="text-text-muted mt-0.5 shrink-0"
          style={{ color: 'hsl(var(--green))' }}
        />
        <div className="min-w-0">
          <p className="text-text text-sm font-semibold">{d.name}</p>
          <p className="text-text-muted text-xs">{d.country}</p>
        </div>
        <Badge variant="outline" className="ml-auto shrink-0 text-[10px]">
          {d.continent}
        </Badge>
      </div>
    )
  }

  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 px-4 pt-4 pb-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <MapPinIcon size={14} className="shrink-0" style={{ color: 'hsl(var(--accent))' }} />
            <h3 className="text-text truncate text-base font-semibold">{d.name}</h3>
          </div>
          <p className="text-text-muted mt-0.5 text-xs">{d.country}</p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <Badge variant="outline" className="text-[10px]">
            {d.continent}
          </Badge>
          {d.visitedDates && d.visitedDates.length > 0 && (
            <p className="text-text-muted text-[10px]">
              {d.visitedDates.map(formatVisitDate).join(' · ')}
            </p>
          )}
        </div>
      </div>

      {/* Recommendations toggle */}
      {hasRecs && (
        <>
          <button
            onClick={() => setOpen((v) => !v)}
            className="border-border text-text-muted hover:text-text hover:bg-surface-2/60 flex w-full items-center justify-between border-t px-4 py-2.5 text-xs font-medium transition-colors"
            aria-expanded={open}
          >
            <span>
              {open ? 'Hide' : 'Show'} recommendations ({d.recommendations!.length})
            </span>
            <ChevronDownIcon
              size={14}
              className={cn('transition-transform duration-200', open && 'rotate-180')}
            />
          </button>

          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <ul className="divide-border divide-y px-4 pb-1">
                  {d.recommendations!.map((rec, i) => (
                    <li key={i} className="py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm" aria-hidden>
                          {TYPE_ICON[rec.type]}
                        </span>
                        <span className="text-text text-xs font-semibold">{rec.name}</span>
                        <span className="text-text-muted/60 ml-auto shrink-0 text-[10px] tracking-wide uppercase">
                          {TYPE_LABEL[rec.type]}
                        </span>
                      </div>
                      <p className="text-text-muted mt-0.5 pl-6 text-xs leading-relaxed">
                        {rec.note}
                      </p>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Journal link */}
      {d.journalSlug && (
        <div className="border-border border-t px-4 py-2.5">
          <Link
            href={`/writing/blog/${d.journalSlug}`}
            className="text-accent hover:text-accent-hover text-xs font-medium underline-offset-2 hover:underline"
          >
            Read journal →
          </Link>
        </div>
      )}
    </div>
  )
}
