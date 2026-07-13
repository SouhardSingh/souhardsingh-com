'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBestScore } from '@/hooks/use-best-score'

const BEST_KEY = 'comet-game-best'

function cssVar(name: string) {
  return `hsl(${getComputedStyle(document.documentElement).getPropertyValue(name).trim()})`
}

type Phase = 'ready' | 'playing' | 'over'

interface Rock {
  x: number
  y: number
  r: number
  vy: number
  vx: number
}

interface Props {
  variant?: 'overlay' | 'inline'
  open?: boolean
  onClose?: () => void
}

export function CometGame({ variant = 'inline', open = true, onClose }: Props) {
  const reduced = useReducedMotion()
  const stageRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const [phase, setPhase] = useState<Phase>('ready')
  const [score, setScore] = useState(0)
  const { best, submit: submitBest } = useBestScore(BEST_KEY)

  const start = useCallback(() => {
    setScore(0)
    setPhase('playing')
  }, [])

  // Escape closes the overlay.
  useEffect(() => {
    if (variant !== 'overlay' || !open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [variant, open, onClose])

  const visible = variant !== 'overlay' || open

  // Main game loop — recreated when a run starts.
  useEffect(() => {
    if (!visible) return
    const canvas = canvasRef.current
    const stage = stageRef.current
    if (!canvas || !stage) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = 0
    let H = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      W = stage.clientWidth
      H = stage.clientHeight
      canvas.width = W * dpr
      canvas.height = H * dpr
      canvas.style.width = `${W}px`
      canvas.style.height = `${H}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(stage)

    const unit = () => Math.min(W, H)
    const player = { x: W / 2, y: H * 0.78, r: 0 }
    let target = { x: player.x, y: player.y }
    let usePointer = false
    const keys = new Set<string>()
    const rocks: Rock[] = []
    const trail: { x: number; y: number }[] = []
    let localScore = 0
    let paused = false
    let raf = 0
    let gameOver = false
    let hudTick = 0

    const onKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a', 'd', 'w', 's'].includes(e.key)) {
        keys.add(e.key)
        usePointer = false
        if (phase === 'playing') e.preventDefault()
      }
      if ((e.key === ' ' || e.key === 'Enter') && phase !== 'playing') start()
    }
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key)
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      target = { x: e.clientX - rect.left, y: e.clientY - rect.top }
      usePointer = true
    }
    const onBlur = () => (paused = true)
    const onFocus = () => (paused = false)
    const onVis = () => (paused = document.hidden)

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    canvas.addEventListener('pointermove', onPointerMove)
    window.addEventListener('blur', onBlur)
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVis)

    const spawn = () => {
      const u = unit()
      const r = u * (0.02 + Math.random() * 0.02)
      const level = localScore / 1200
      const speed = u * (0.004 + Math.random() * 0.004) * (1 + level) * (reduced ? 0.6 : 1)
      rocks.push({
        x: Math.random() * W,
        y: -r,
        r,
        vy: speed,
        vx: (Math.random() - 0.5) * u * 0.001,
      })
    }

    const draw = () => {
      raf = requestAnimationFrame(draw)
      const u = unit()
      player.r = u * 0.02
      ctx.clearRect(0, 0, W, H)

      if (phase === 'playing' && !paused && !gameOver) {
        localScore += 1 + localScore / 4000
        // Mirror the running score into React ~10×/s rather than every frame.
        if (++hudTick % 6 === 0) setScore(Math.floor(localScore))

        // Player control
        if (usePointer) {
          player.x += (target.x - player.x) * 0.25
          player.y += (target.y - player.y) * 0.25
        } else {
          const a = u * 0.012
          if (keys.has('ArrowLeft') || keys.has('a')) player.x -= a
          if (keys.has('ArrowRight') || keys.has('d')) player.x += a
          if (keys.has('ArrowUp') || keys.has('w')) player.y -= a
          if (keys.has('ArrowDown') || keys.has('s')) player.y += a
        }
        player.x = Math.max(player.r, Math.min(W - player.r, player.x))
        player.y = Math.max(player.r, Math.min(H - player.r, player.y))

        // Spawn
        const rate = (reduced ? 0.014 : 0.026) + localScore / 90000
        if (Math.random() < rate) spawn()

        // Move rocks + collide
        for (let i = rocks.length - 1; i >= 0; i--) {
          const rk = rocks[i]
          rk.y += rk.vy
          rk.x += rk.vx
          if (rk.y - rk.r > H) {
            rocks.splice(i, 1)
            continue
          }
          const dx = rk.x - player.x
          const dy = rk.y - player.y
          if (!gameOver && dx * dx + dy * dy < (rk.r + player.r * 0.8) ** 2) {
            gameOver = true
            const final = Math.floor(localScore)
            setScore(final)
            setPhase('over')
            submitBest(final)
          }
        }

        // Trail
        trail.unshift({ x: player.x, y: player.y })
        if (trail.length > 14) trail.pop()
      }

      // Draw rocks
      const rockColor = cssVar('--text-muted')
      for (const rk of rocks) {
        ctx.beginPath()
        ctx.arc(rk.x, rk.y, rk.r, 0, Math.PI * 2)
        ctx.fillStyle = rockColor
        ctx.globalAlpha = 0.55
        ctx.fill()
        ctx.globalAlpha = 1
      }

      // Draw player comet trail + head
      const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
      if (!reduced) {
        for (let i = trail.length - 1; i >= 0; i--) {
          const t = i / trail.length
          ctx.beginPath()
          ctx.arc(trail[i].x, trail[i].y, player.r * (1 - t) * 0.9, 0, Math.PI * 2)
          ctx.fillStyle = `hsl(${accent} / ${0.35 * (1 - t)})`
          ctx.fill()
        }
      }
      ctx.beginPath()
      ctx.arc(player.x, player.y, player.r, 0, Math.PI * 2)
      ctx.fillStyle = `hsl(${accent})`
      ctx.shadowColor = `hsl(${accent})`
      ctx.shadowBlur = reduced ? 0 : 12
      ctx.fill()
      ctx.shadowBlur = 0
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      canvas.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('blur', onBlur)
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [visible, phase, reduced, start, submitBest])

  if (!visible) return null

  const stage = (
    <div
      ref={stageRef}
      className={cn(
        'bg-surface-2 relative w-full touch-none overflow-hidden rounded-xl',
        variant === 'overlay' && 'h-full'
      )}
      style={{ aspectRatio: variant === 'overlay' ? undefined : '4 / 3' }}
    >
      <canvas ref={canvasRef} className="block size-full" />

      {/* HUD */}
      <div className="text-text-muted pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 py-2 text-xs">
        <span>Score {score.toLocaleString()}</span>
        <span>Best {best.toLocaleString()}</span>
      </div>

      {/* Start / Over overlay */}
      {phase !== 'playing' && (
        <div className="bg-bg/70 absolute inset-0 flex flex-col items-center justify-center gap-3 text-center backdrop-blur-sm">
          <p className="font-display text-text text-2xl font-bold">
            {phase === 'over' ? 'Nice run!' : 'Comet Run'}
          </p>
          {phase === 'over' ? (
            <p className="text-text-muted text-sm">
              You scored {score.toLocaleString()} · best {best.toLocaleString()}
            </p>
          ) : (
            <p className="text-text-muted max-w-xs text-sm">
              Steer the comet with arrow keys, WASD, or your finger. Dodge the falling rocks as long
              as you can.
            </p>
          )}
          <button
            onClick={start}
            className="bg-accent text-bg hover:bg-accent-hover mt-1 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors"
          >
            {phase === 'over' ? 'Play again' : 'Start'}
          </button>
        </div>
      )}
    </div>
  )

  if (variant === 'inline') return stage

  return (
    <div className="bg-bg/95 fixed inset-0 z-[60] flex flex-col items-center justify-center gap-4 p-4 backdrop-blur-md">
      <button
        onClick={onClose}
        aria-label="Close game"
        className="text-text-muted hover:bg-surface-2 hover:text-text absolute top-4 right-4 flex size-11 items-center justify-center rounded-md"
      >
        <XIcon size={20} />
      </button>
      <p className="text-accent text-xs font-medium tracking-wide uppercase">
        ✨ You found the secret
      </p>
      <div className="h-[min(75dvh,600px)] w-[min(92vw,720px)]">
        {/* Reuse the same stage sizing for overlay */}
        <div className="size-full">{stage}</div>
      </div>
      <p className="text-text-muted text-xs">Press Esc to close</p>
    </div>
  )
}
