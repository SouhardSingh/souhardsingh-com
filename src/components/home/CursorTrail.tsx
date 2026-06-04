'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

type Point = { x: number; y: number; age: number }

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

    const points: Point[] = []

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e: MouseEvent) => {
      points.push({ x: e.clientX, y: e.clientY, age: 0 })
      if (points.length > 28) points.shift()
    }
    window.addEventListener('mousemove', onMove)

    const channels = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
    let raf: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = points.length - 1; i >= 0; i--) {
        points[i].age += 1
        if (points[i].age > 20) {
          points.splice(i, 1)
          continue
        }
        const alpha = (1 - points[i].age / 20) * 0.55
        const radius = 4 * (1 - points[i].age / 20)
        ctx.beginPath()
        ctx.arc(points[i].x, points[i].y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `hsl(${channels} / ${alpha})`
        ctx.fill()
      }
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
    }
  }, [reduced])

  if (reduced) return null

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50" aria-hidden />
}
