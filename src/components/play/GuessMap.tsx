'use client'

import { useRef } from 'react'
import { ComposableMap, Geographies, Geography, Marker, Line } from 'react-simple-maps'
import type { LatLng } from '@/types'

const GEO_URL = '/geo/countries-110m.json'

// Equirectangular world sized so screen↔lat/lng is a pure linear map.
const W = 800
const H = 400
const SCALE = W / (2 * Math.PI) // ≈ 127.32
const TX = W / 2
const TY = H / 2

interface Props {
  onGuess: (p: LatLng) => void
  guess?: LatLng | null
  actual?: (LatLng & { name?: string }) | null
  disabled?: boolean
}

export function GuessMap({ onGuess, guess, actual, disabled }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)

  function handleClick(e: React.MouseEvent) {
    if (disabled) return
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const svgX = ((e.clientX - rect.left) / rect.width) * W
    const svgY = ((e.clientY - rect.top) / rect.height) * H
    const lng = (((svgX - TX) / SCALE) * 180) / Math.PI
    const lat = (((TY - svgY) / SCALE) * 180) / Math.PI
    onGuess({
      lat: Math.max(-90, Math.min(90, lat)),
      lng: Math.max(-180, Math.min(180, lng)),
    })
  }

  return (
    <div
      ref={wrapRef}
      onClick={handleClick}
      className={disabled ? 'cursor-default' : 'cursor-crosshair'}
    >
      <ComposableMap
        projection="geoEquirectangular"
        projectionConfig={{ scale: SCALE, center: [0, 0] }}
        width={W}
        height={H}
        style={{ width: '100%', height: 'auto' }}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="hsl(var(--surface-2))"
                stroke="hsl(var(--border))"
                strokeWidth={0.4}
                style={{
                  default: { outline: 'none' },
                  hover: { outline: 'none', fill: 'hsl(var(--surface-2))' },
                  pressed: { outline: 'none' },
                }}
              />
            ))
          }
        </Geographies>

        {guess && actual && (
          <Line
            from={[guess.lng, guess.lat]}
            to={[actual.lng, actual.lat]}
            stroke="hsl(var(--text-muted))"
            strokeWidth={1}
            strokeDasharray="4 3"
            strokeLinecap="round"
          />
        )}

        {guess && (
          <Marker coordinates={[guess.lng, guess.lat]}>
            <circle r={5} fill="hsl(var(--accent))" stroke="hsl(var(--bg))" strokeWidth={1.5} />
          </Marker>
        )}

        {actual && (
          <Marker coordinates={[actual.lng, actual.lat]}>
            <circle r={5} fill="hsl(var(--green))" stroke="hsl(var(--bg))" strokeWidth={1.5} />
            {actual.name && (
              <text
                textAnchor="middle"
                y={-10}
                className="font-body"
                style={{ fill: 'hsl(var(--text))', fontSize: 11, fontWeight: 600 }}
              >
                {actual.name}
              </text>
            )}
          </Marker>
        )}
      </ComposableMap>
    </div>
  )
}
