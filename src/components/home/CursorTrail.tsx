'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

type Point = { x: number; y: number; age: number }

const MAX_POINTS = 32
const MAX_AGE = 26
const LERP = 0.16 // spring factor — lower = more elastic lag

function readAccentChannels() {
  return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W
    canvas.height = H

    const onResize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
    }
    window.addEventListener('resize', onResize, { passive: true })

    // Spring-interpolated head — lags behind the real cursor
    let headX = W / 2
    let headY = H / 2
    let targetX = W / 2
    let targetY = H / 2

    const points: Point[] = []

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    let accentChannels = readAccentChannels()
    let themeCheckTick = 0
    let raf: number

    const draw = () => {
      // Re-read accent every ~120 frames to catch theme switches without per-frame style query
      themeCheckTick++
      if (themeCheckTick % 120 === 0) accentChannels = readAccentChannels()

      // Spring lerp head toward real cursor
      headX += (targetX - headX) * LERP
      headY += (targetY - headY) * LERP

      // Add new point if head moved enough
      const last = points[0]
      const dx = last ? headX - last.x : Infinity
      const dy = last ? headY - last.y : Infinity
      if (!last || dx * dx + dy * dy > 3) {
        points.unshift({ x: headX, y: headY, age: 0 })
        if (points.length > MAX_POINTS) points.pop()
      }

      // Age all points
      for (const p of points) p.age++

      // Evict expired
      while (points.length && points[points.length - 1].age >= MAX_AGE) points.pop()

      ctx.clearRect(0, 0, W, H)

      if (points.length < 2) {
        raf = requestAnimationFrame(draw)
        return
      }

      const n = points.length

      // Pass 1 — soft glow bloom (2× radius, very low alpha)
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1) // 0 = head, 1 = tail
        const ageFade = 1 - points[i].age / MAX_AGE
        const r = (5.5 - t * 4) * 2
        const alpha = ageFade * 0.065 * (1 - t * 0.5)
        if (alpha < 0.005) continue
        ctx.beginPath()
        ctx.arc(points[i].x, points[i].y, Math.max(r, 1), 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${accentChannels} / ${alpha})`
        ctx.fill()
      }

      // Pass 2 — crisp comet circles: head is largest, tail tapers to a point
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1)
        const ageFade = 1 - points[i].age / MAX_AGE
        const r = Math.max(0.6, (5.5 - t * 4.5) * ageFade)
        const alpha = ageFade * 0.62 * (1 - t * 0.45)
        if (alpha < 0.01) continue
        ctx.beginPath()
        ctx.arc(points[i].x, points[i].y, r, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${accentChannels} / ${alpha})`
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [reduced])

  if (reduced) return null

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50" aria-hidden />
}
