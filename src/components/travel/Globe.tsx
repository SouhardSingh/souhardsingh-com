'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import { useReducedMotion } from 'framer-motion'
import createGlobe from 'cobe'
import type { Destination } from '@/types'
import { GlobeMarkerCard } from './GlobeMarkerCard'

const MAX_SIZE = 560
const AUTO_SPEED = 0.0035 // radians per frame
const DRAG_MULT = 3 // pointer-drag sensitivity
const THETA_MIN = -1.1
const THETA_MAX = 1.1
const FOCUS_EASE = 0.1
const MARKER_R = 0.85 // cobe globe radius (0.8) + marker elevation (0.05)

/** Parse an `H S% L%` CSS custom property into a normalized [r,g,b] triple (0–1). */
function hslVarToRgb(varName: string): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
  const [hs, ss, ls] = raw.split(/\s+/)
  const h = parseFloat(hs)
  const s = parseFloat(ss) / 100
  const l = parseFloat(ls) / 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let r = 0
  let g = 0
  let b = 0
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  return [r + m, g + m, b + m]
}

/**
 * Project [lat, lng] to normalized canvas coords using cobe's exact internal math
 * (its `U` + `O` functions), so overlay dots land precisely on the rendered globe.
 * Returns x/y in 0–1 and whether the point faces the viewer.
 */
function project(lat: number, lng: number, phi: number, theta: number) {
  const rLat = (lat * Math.PI) / 180
  const rLng = (lng * Math.PI) / 180 - Math.PI
  const o = Math.cos(rLat)
  // 3D point on the sphere at marker radius
  const px = -o * Math.cos(rLng) * MARKER_R
  const py = Math.sin(rLat) * MARKER_R
  const pz = o * Math.sin(rLng) * MARKER_R
  // rotate by phi (f) and theta (l)
  const cl = Math.cos(theta)
  const sl = Math.sin(theta)
  const ct = Math.cos(phi)
  const st = Math.sin(phi)
  const c = ct * px + st * pz
  const s = st * sl * px + cl * py - ct * sl * pz
  const depth = -st * cl * px + sl * py + ct * cl * pz
  return {
    x: (c + 1) / 2,
    y: (-s + 1) / 2,
    front: depth >= 0,
    depth,
  }
}

interface HoverState {
  dest: Destination
  x: number
  y: number
}

interface Props {
  destinations: Destination[]
}

export function Globe({ destinations }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([])
  const posRef = useRef<{ x: number; y: number }[]>([])

  const reduced = useReducedMotion()
  const { resolvedTheme } = useTheme()
  const [size, setSize] = useState(0)
  const [hover, setHover] = useState<HoverState | null>(null)

  // Rotation state persists across globe re-creations (theme / resize) so it never jumps.
  const phiRef = useRef(0)
  const thetaRef = useRef(0.3)
  const draggingRef = useRef(false)
  const pausedRef = useRef(false) // paused while inspecting a marker
  const focusRef = useRef<{ phi: number; theta: number } | null>(null)
  const visibleRef = useRef(true)
  const dragStart = useRef({ x: 0, y: 0, phi: 0, theta: 0, moved: false })

  // Measure the square size responsively.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setSize(Math.min(el.clientWidth, MAX_SIZE)))
    ro.observe(el)
    setSize(Math.min(el.clientWidth, MAX_SIZE))
    return () => ro.disconnect()
  }, [])

  // Pause auto-spin when the globe scrolls off-screen or the tab is hidden.
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => (visibleRef.current = entry.isIntersecting), {
      threshold: 0.05,
    })
    io.observe(el)
    const onVis = () => {
      if (document.hidden) visibleRef.current = false
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  // Create the cobe globe + drive it with our own rAF loop (cobe v2 has no internal loop).
  useEffect(() => {
    if (!size || !canvasRef.current) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const isDark = resolvedTheme === 'dark'

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: dpr,
      width: size * dpr,
      height: size * dpr,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: isDark ? 1 : 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: isDark ? 4 : 6,
      baseColor: hslVarToRgb(isDark ? '--surface-2' : '--surface'),
      markerColor: hslVarToRgb('--accent'),
      glowColor: hslVarToRgb(isDark ? '--surface-2' : '--accent'),
      opacity: 0.95,
      markers: [],
    })

    let raf = 0
    let lastPhi = NaN
    let lastTheta = NaN

    const loop = () => {
      const focus = focusRef.current
      if (focus) {
        phiRef.current += (focus.phi - phiRef.current) * FOCUS_EASE
        thetaRef.current += (focus.theta - thetaRef.current) * FOCUS_EASE
        if (
          Math.abs(focus.phi - phiRef.current) < 0.003 &&
          Math.abs(focus.theta - thetaRef.current) < 0.003
        ) {
          focusRef.current = null
        }
      } else if (!draggingRef.current && !pausedRef.current && !reduced && visibleRef.current) {
        phiRef.current += AUTO_SPEED
      }

      const phi = phiRef.current
      const theta = thetaRef.current

      // Only redraw when something actually changed.
      if (phi !== lastPhi || theta !== lastTheta) {
        lastPhi = phi
        lastTheta = theta
        globe.update({ phi, theta })

        for (let i = 0; i < destinations.length; i++) {
          const [lng, lat] = destinations[i].coordinates
          const p = project(lat, lng, phi, theta)
          posRef.current[i] = { x: p.x * size, y: p.y * size }
          const dot = dotRefs.current[i]
          if (dot) {
            const scale = 0.7 + 0.3 * Math.max(p.depth, 0)
            dot.style.transform = `translate(${p.x * size}px, ${p.y * size}px) translate(-50%, -50%) scale(${scale})`
            dot.style.opacity = p.front ? '1' : '0'
            dot.style.pointerEvents = p.front ? 'auto' : 'none'
          }
        }
      }
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      globe.destroy()
    }
  }, [size, resolvedTheme, reduced, destinations])

  // --- Drag to rotate (pointer + touch) ---
  function onPointerDown(e: React.PointerEvent) {
    draggingRef.current = true
    focusRef.current = null
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      phi: phiRef.current,
      theta: thetaRef.current,
      moved: false,
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current || !size) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragStart.current.moved = true
    phiRef.current = dragStart.current.phi + (dx / size) * DRAG_MULT
    thetaRef.current = Math.max(
      THETA_MIN,
      Math.min(THETA_MAX, dragStart.current.theta - (dy / size) * DRAG_MULT)
    )
  }

  function onPointerUp() {
    draggingRef.current = false
  }

  // Spin a destination to the front and open its card.
  function focusDestination(dest: Destination, index: number) {
    if (dragStart.current.moved) return
    const [lng, lat] = dest.coordinates
    // Solve phi/theta that bring this point to the front-center (from cobe's projection).
    let targetPhi = -Math.PI / 2 - (lng * Math.PI) / 180
    // Pick the rotation nearest the current angle so it takes the short way around.
    while (targetPhi - phiRef.current > Math.PI) targetPhi -= 2 * Math.PI
    while (targetPhi - phiRef.current < -Math.PI) targetPhi += 2 * Math.PI
    focusRef.current = { phi: targetPhi, theta: (lat * Math.PI) / 180 }
    pausedRef.current = true
    const pos = posRef.current[index]
    setHover({ dest, x: pos?.x ?? size / 2, y: pos?.y ?? size / 2 })
  }

  function openHover(dest: Destination, index: number) {
    pausedRef.current = true
    const pos = posRef.current[index]
    if (pos) setHover({ dest, x: pos.x, y: pos.y })
  }

  function closeHover() {
    pausedRef.current = false
    setHover(null)
  }

  return (
    <div className="mx-auto flex flex-col items-center">
      <div
        ref={wrapRef}
        className="relative w-full max-w-[560px] touch-none select-none"
        style={{ aspectRatio: '1 / 1' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {size > 0 && (
          <canvas
            ref={canvasRef}
            width={size}
            height={size}
            className="cursor-grab active:cursor-grabbing"
            style={{ width: size, height: size }}
            onClick={closeHover}
            aria-hidden
          />
        )}

        {/* Interactive marker dots — positioned imperatively by the rAF loop */}
        {size > 0 &&
          destinations.map((d, i) => {
            const visited = d.status === 'visited'
            return (
              <button
                key={d.slug}
                ref={(el) => {
                  dotRefs.current[i] = el
                }}
                type="button"
                aria-label={`${d.name}, ${d.country}`}
                onPointerEnter={() => openHover(d, i)}
                onFocus={() => openHover(d, i)}
                onClick={() => focusDestination(d, i)}
                className="absolute top-0 left-0 size-3 rounded-full opacity-0 ring-2 ring-[hsl(var(--bg))] focus-visible:outline-none md:size-2.5"
                style={{
                  backgroundColor: visited ? 'hsl(var(--accent))' : 'hsl(var(--green))',
                  boxShadow: `0 0 8px 1px ${
                    visited ? 'hsl(var(--accent) / 0.7)' : 'hsl(var(--green) / 0.6)'
                  }`,
                }}
              />
            )
          })}

        {hover && (
          <GlobeMarkerCard
            destination={hover.dest}
            x={hover.x}
            y={hover.y}
            containerSize={size}
            onClose={closeHover}
          />
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-5 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: 'hsl(var(--accent))' }} />
          <span className="text-text-muted">Visited</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-full" style={{ background: 'hsl(var(--green))' }} />
          <span className="text-text-muted">Wishlist</span>
        </span>
        <span className="text-text-muted hidden sm:inline">· drag to rotate, tap a pin</span>
      </div>
    </div>
  )
}
