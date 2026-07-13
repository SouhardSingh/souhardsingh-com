'use client'

import { XIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Destination } from '@/types'

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
  x: number
  y: number
  containerSize: number
  onClose: () => void
}

export function GlobeMarkerCard({ destination: d, x, y, containerSize, onClose }: Props) {
  // Keep the card inside the globe container, flipping side/vertical as needed.
  const flipRight = x > containerSize * 0.6
  const flipDown = y < containerSize * 0.3
  const left = flipRight ? x - 12 : x + 12
  const top = flipDown ? y + 14 : y - 14

  return (
    <div
      className="bg-surface border-border text-text absolute z-20 w-max max-w-[200px] rounded-lg border px-3 py-2 shadow-lg"
      style={{
        left,
        top,
        transform: `translate(${flipRight ? '-100%' : '0'}, ${flipDown ? '0' : '-100%'})`,
      }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="text-text-muted hover:text-text absolute top-1 right-1 flex size-5 items-center justify-center rounded"
      >
        <XIcon size={12} />
      </button>
      <p className="text-text pr-4 text-sm font-semibold">{d.name}</p>
      <p className="text-text-muted text-xs">{d.country}</p>
      <div className="mt-1.5 flex items-center gap-1.5">
        <Badge variant="outline" className="text-[10px]">
          {d.continent}
        </Badge>
        {d.visitedDates && d.visitedDates.length > 0 && (
          <span className="text-text-muted text-[10px]">
            {d.visitedDates.map(formatVisitDate).join(' · ')}
          </span>
        )}
      </div>
      {d.journalSlug && (
        <a
          href={`/writing/blog/${d.journalSlug}`}
          className="text-accent hover:text-accent-hover mt-1.5 block text-xs font-medium"
        >
          Read journal →
        </a>
      )}
    </div>
  )
}
