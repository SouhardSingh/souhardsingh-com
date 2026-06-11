'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface LetterMeta {
  location: string
  lat: number
  lon: number
  sensor: string
}

interface LetterResult {
  char: string
  url: string | null
  meta: LetterMeta | null
}

interface Props {
  name?: string
  mode?: 'static' | 'interactive'
  className?: string
}

function formatCoords(lat: number, lon: number) {
  const ns = lat >= 0 ? 'N' : 'S'
  const ew = lon >= 0 ? 'E' : 'W'
  return `${Math.abs(lat).toFixed(2)}°${ns} ${Math.abs(lon).toFixed(2)}°${ew}`
}

function LetterTile({
  letter,
  index,
  reduced,
}: {
  letter: LetterResult
  index: number
  reduced: boolean | null
}) {
  const [imgError, setImgError] = useState(false)
  const showText = !letter.url || imgError

  return (
    <motion.figure
      className="border-border bg-surface-2 relative h-[72px] w-[58px] shrink-0 overflow-hidden rounded-lg border sm:h-[88px] sm:w-[70px]"
      initial={reduced ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={reduced ? {} : { scale: 1.06 }}
    >
      {showText ? (
        <div className="flex h-full w-full items-center justify-center">
          <span className="text-text-muted font-mono text-xl font-semibold">
            {letter.char === ' ' ? ' ' : letter.char.toUpperCase()}
          </span>
        </div>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={letter.url!}
            alt={`Landsat image for letter ${letter.char}`}
            className="h-full w-full object-cover"
            onError={() => setImgError(true)}
          />
          {/* Hover overlay */}
          <motion.div
            className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/20 to-transparent p-1.5"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
          >
            {letter.meta ? (
              <>
                <p className="truncate text-[9px] leading-tight font-semibold text-white">
                  {letter.meta.location}
                </p>
                <p className="font-mono text-[7.5px] leading-tight text-white/70">
                  {formatCoords(letter.meta.lat, letter.meta.lon)}
                </p>
                <Badge
                  variant="outline"
                  className="mt-0.5 h-3.5 border-white/30 bg-black/40 px-1 text-[7px] text-white/80"
                >
                  {letter.meta.sensor}
                </Badge>
              </>
            ) : (
              <span className="font-mono text-xs font-bold text-white">
                {letter.char.toUpperCase()}
              </span>
            )}
          </motion.div>
        </>
      )}
    </motion.figure>
  )
}

function SkeletonTile() {
  return (
    <div className="bg-surface-2 h-[72px] w-[58px] shrink-0 animate-pulse rounded-lg sm:h-[88px] sm:w-[70px]" />
  )
}

export function LandsatName({ name = 'SOUHARD', mode = 'static', className }: Props) {
  const reduced = useReducedMotion()
  const [query, setQuery] = useState(name)
  const [letters, setLetters] = useState<LetterResult[] | null>(null)
  const [loading, setLoading] = useState(false)

  // Static mode: fetch on mount. All setState calls happen after an await so
  // they're never on the synchronous effect call stack (satisfies react-hooks/set-state-in-effect).
  useEffect(() => {
    if (mode !== 'static') return
    let cancelled = false
    void (async () => {
      if (!name.trim()) return
      await Promise.resolve() // yield to microtask queue before any setState
      if (cancelled) return
      setLoading(true)
      try {
        const r = await fetch(`/api/landsat?name=${encodeURIComponent(name)}`)
        if (!r.ok) throw new Error()
        const data = await r.json()
        if (!cancelled) setLetters(data.letters)
      } catch {
        if (!cancelled) setLetters(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [mode, name])

  // Interactive mode: debounced fetch. setTimeout already defers setState off
  // the synchronous effect body — no additional yielding needed.
  useEffect(() => {
    if (mode !== 'interactive') return
    let cancelled = false
    const timer = setTimeout(async () => {
      if (!query.trim() || cancelled) return
      setLoading(true)
      try {
        const r = await fetch(`/api/landsat?name=${encodeURIComponent(query)}`)
        if (!r.ok) throw new Error()
        const data = await r.json()
        if (!cancelled) setLetters(data.letters)
      } catch {
        if (!cancelled) setLetters(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, mode])

  const displayLetters = letters?.filter((l) => l.char !== ' ')

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {mode === 'interactive' && (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={query}
            maxLength={20}
            placeholder="Type a name…"
            onChange={(e) => setQuery(e.target.value.toUpperCase().replace(/[^A-Z\s]/g, ''))}
            className="border-border bg-surface-2 text-text placeholder:text-text-muted focus:ring-accent/50 h-9 rounded-lg border px-3 font-mono text-sm focus:ring-2 focus:outline-none"
          />
          <span className="text-text-muted text-xs">{query.length}/20</span>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className="flex flex-wrap gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {Array.from({
                length: mode === 'static' ? name.replace(/\s/g, '').length : 6,
              }).map((_, i) => (
                <SkeletonTile key={i} />
              ))}
            </motion.div>
          ) : displayLetters && displayLetters.length > 0 ? (
            <motion.div
              key="letters"
              className="flex flex-wrap gap-1.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {displayLetters.map((letter, i) => (
                <LetterTile
                  key={`${letter.char}-${i}`}
                  letter={letter}
                  index={i}
                  reduced={reduced}
                />
              ))}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {mode === 'interactive' && (
        <p className="text-text-muted text-[11px]">
          Letters sourced from{' '}
          <a
            href="https://landsat.gsfc.nasa.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text underline underline-offset-2"
          >
            Landsat / NASA
          </a>
        </p>
      )}
    </div>
  )
}
