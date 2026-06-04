'use client'

import React, { useState } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import type { Destination } from '@/types'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

interface Props {
  destinations: Destination[]
}

interface TooltipState {
  name: string
  status: string
  x: number
  y: number
}

export function WorldMap({ destinations }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const visited = new Set(destinations.filter((d) => d.status === 'visited').map((d) => d.name))
  const wishlist = new Set(destinations.filter((d) => d.status === 'wishlist').map((d) => d.name))

  return (
    <div className="relative w-full overflow-x-auto">
      <ComposableMap
        projectionConfig={{ scale: 140 }}
        style={{ width: '100%', height: 'auto' }}
        height={400}
      >
        <ZoomableGroup zoom={1} minZoom={1} maxZoom={6}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { outline: 'none' },
                    hover: { outline: 'none' },
                    pressed: { outline: 'none' },
                  }}
                  fill="hsl(var(--surface-2))"
                  stroke="hsl(var(--border))"
                  strokeWidth={0.5}
                />
              ))
            }
          </Geographies>

          {destinations.map((dest) => (
            <Marker
              key={dest.slug}
              coordinates={dest.coordinates as [number, number]}
              onMouseEnter={(e: React.MouseEvent<SVGGElement>) => {
                const target = e.currentTarget as SVGGElement
                const rect = target.getBoundingClientRect()
                setTooltip({
                  name: dest.name,
                  status: dest.status,
                  x: rect.x,
                  y: rect.y,
                })
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              <circle
                r={dest.status === 'visited' ? 5 : 4}
                fill={
                  dest.status === 'visited'
                    ? 'hsl(var(--accent) / 0.85)'
                    : 'hsl(var(--green) / 0.7)'
                }
                stroke="hsl(var(--bg))"
                strokeWidth={1.5}
                className="cursor-pointer transition-transform hover:scale-125"
              />
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-5 px-2 text-xs">
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-full"
            style={{ background: 'hsl(var(--accent) / 0.85)' }}
          />
          <span className="text-text-muted">Visited</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-full"
            style={{ background: 'hsl(var(--green) / 0.7)' }}
          />
          <span className="text-text-muted">Wishlist</span>
        </span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="bg-surface border-border text-text pointer-events-none fixed z-50 rounded-lg border px-3 py-2 text-sm shadow-md"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          <p className="font-medium">{tooltip.name}</p>
          <p className="text-text-muted text-xs capitalize">{tooltip.status}</p>
        </div>
      )}
    </div>
  )
}
