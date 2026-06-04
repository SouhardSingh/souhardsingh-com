'use client'

import { useState } from 'react'
import type { Destination } from '@/types'

const CONTINENT_FLAGS: Record<string, string> = {
  Asia: '🌏',
  Europe: '🌍',
  'North America': '🌎',
  'South America': '🌎',
  Africa: '🌍',
  Oceania: '🌏',
  Antarctica: '🧊',
}

interface Props {
  destinations: Destination[]
}

export function BucketList({ destinations }: Props) {
  const [checked, setChecked] = useState<Set<string>>(() => {
    try {
      return new Set(JSON.parse(localStorage.getItem('bucket-list') ?? '[]') as string[])
    } catch {
      return new Set()
    }
  })

  const toggle = (slug: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) {
        next.delete(slug)
      } else {
        next.add(slug)
      }
      try {
        localStorage.setItem('bucket-list', JSON.stringify([...next]))
      } catch {}
      return next
    })
  }

  const byContinent = destinations.reduce<Record<string, Destination[]>>((acc, d) => {
    ;(acc[d.continent] ??= []).push(d)
    return acc
  }, {})

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h2 className="text-text mb-6 text-lg font-semibold">Bucket list</h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Object.entries(byContinent).map(([continent, places]) => (
          <div key={continent}>
            <h3 className="text-text-muted mb-3 flex items-center gap-1.5 text-sm font-medium tracking-wide uppercase">
              <span aria-hidden>{CONTINENT_FLAGS[continent] ?? '🌐'}</span>
              {continent}
            </h3>
            <ul className="space-y-2">
              {places.map((dest) => (
                <li key={dest.slug} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`bucket-${dest.slug}`}
                    checked={checked.has(dest.slug)}
                    onChange={() => toggle(dest.slug)}
                    className="accent-accent size-4 cursor-pointer rounded"
                  />
                  <label
                    htmlFor={`bucket-${dest.slug}`}
                    className="text-text-muted cursor-pointer text-sm select-none"
                  >
                    {dest.name}
                    {dest.country && (
                      <span className="text-text-muted/60 ml-1 text-xs">({dest.country})</span>
                    )}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
