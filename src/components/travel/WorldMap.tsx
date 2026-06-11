'use client'

import React, { useState, useMemo } from 'react'
import { ComposableMap, Geographies, Geography, Marker, ZoomableGroup } from 'react-simple-maps'
import type { Destination } from '@/types'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

interface Props {
  destinations: Destination[]
}

interface TooltipState {
  content: string
  x: number
  y: number
}

function computeMapConfig(visited: Destination[]) {
  if (visited.length === 0) return { center: [0, 20] as [number, number], zoom: 1 }

  const continents = new Set(visited.map((d) => d.continent))

  if (continents.size === 1) {
    // All visited in one continent — zoom to centroid
    const avgLng = visited.reduce((s, d) => s + d.coordinates[0], 0) / visited.length
    const avgLat = visited.reduce((s, d) => s + d.coordinates[1], 0) / visited.length
    return {
      center: [avgLng, avgLat] as [number, number],
      zoom: visited.length === 1 ? 3 : 2,
    }
  }

  // Multi-continent — world view
  return { center: [0, 20] as [number, number], zoom: 1 }
}

export function WorldMap({ destinations }: Props) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null)

  const visitedCountries = useMemo(
    () => new Set(destinations.filter((d) => d.status === 'visited').map((d) => d.country)),
    [destinations]
  )
  const wishlistCountries = useMemo(
    () => new Set(destinations.filter((d) => d.status === 'wishlist').map((d) => d.country)),
    [destinations]
  )

  // Group destinations by country for richer tooltips
  const byCountry = useMemo(() => {
    const map: Record<string, Destination[]> = {}
    for (const d of destinations) {
      if (!map[d.country]) map[d.country] = []
      map[d.country].push(d)
    }
    return map
  }, [destinations])

  const visitedDests = useMemo(
    () => destinations.filter((d) => d.status === 'visited'),
    [destinations]
  )
  const { center, zoom } = useMemo(() => computeMapConfig(visitedDests), [visitedDests])

  const visitedCount = visitedDests.length

  return (
    <div className="relative w-full overflow-x-auto">
      {visitedCount === 0 && (
        <p className="text-text-muted py-4 text-center text-sm italic">
          No destinations logged yet — the map grows as you go.
        </p>
      )}

      <ComposableMap
        projectionConfig={{ scale: 140 }}
        style={{ width: '100%', height: 'auto' }}
        height={460}
      >
        <ZoomableGroup zoom={zoom} center={center} minZoom={1} maxZoom={6}>
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryName: string = geo.properties.name
                const isVisited = visitedCountries.has(countryName)
                const isWishlist = wishlistCountries.has(countryName)

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    style={{
                      default: { outline: 'none' },
                      hover: { outline: 'none' },
                      pressed: { outline: 'none' },
                    }}
                    fill={
                      isVisited
                        ? 'hsl(var(--accent) / 0.65)'
                        : isWishlist
                          ? 'hsl(var(--green) / 0.45)'
                          : 'hsl(var(--surface-2))'
                    }
                    stroke="hsl(var(--border))"
                    strokeWidth={0.4}
                    onMouseEnter={(e: React.MouseEvent<SVGPathElement>) => {
                      if (!isVisited && !isWishlist) return
                      const rect = (e.currentTarget as SVGPathElement).getBoundingClientRect()
                      const places = byCountry[countryName] ?? []
                      const cities = places.map((p) => p.name).join(', ')
                      setTooltip({
                        content: `${countryName}${cities ? ` · ${cities}` : ''}`,
                        x: rect.x + rect.width / 2,
                        y: rect.y,
                      })
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    className={isVisited || isWishlist ? 'cursor-pointer' : undefined}
                  />
                )
              })
            }
          </Geographies>

          {/* City-level pins on top of filled countries */}
          {destinations.map((dest) => (
            <Marker
              key={dest.slug}
              coordinates={dest.coordinates as [number, number]}
              onMouseEnter={(e: React.MouseEvent<SVGGElement>) => {
                const rect = (e.currentTarget as SVGGElement).getBoundingClientRect()
                setTooltip({
                  content: `${dest.name}, ${dest.country}`,
                  x: rect.x + rect.width / 2,
                  y: rect.y,
                })
              }}
              onMouseLeave={() => setTooltip(null)}
            >
              <circle
                r={dest.status === 'visited' ? 4 : 3}
                fill={dest.status === 'visited' ? 'hsl(var(--accent))' : 'hsl(var(--green) / 0.8)'}
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
          <span className="size-2.5 rounded-full" style={{ background: 'hsl(var(--accent))' }} />
          <span className="text-text-muted">Visited</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-full"
            style={{ background: 'hsl(var(--green) / 0.8)' }}
          />
          <span className="text-text-muted">Wishlist</span>
        </span>
        <span className="text-text-muted ml-auto">
          {visitedCountries.size} {visitedCountries.size === 1 ? 'country' : 'countries'} visited
        </span>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="bg-surface border-border text-text pointer-events-none fixed z-50 rounded-lg border px-3 py-2 text-sm shadow-md"
          style={{ left: tooltip.x + 12, top: tooltip.y - 8 }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  )
}
