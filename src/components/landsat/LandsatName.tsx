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
  variant?: 'tiles' | 'banner'
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
  variant = 'tiles',
}: {
  letter: LetterResult
  index: number
  reduced: boolean | null
  variant?: 'tiles' | 'banner'
}) {
  const [imgError, setImgError] = useState(false)
  const hasImage = !!letter.url && !imgError
  const isBanner = variant === 'banner'

  return (
    <motion.figure
      className={cn(
        'border-border bg-surface-2 relative overflow-hidden border',
        isBanner
          ? 'h-24 min-w-0 flex-1 rounded-sm sm:h-32 md:h-40 lg:h-48'
          : 'h-[72px] w-[58px] shrink-0 rounded-lg sm:h-[88px] sm:w-[70px]'
      )}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduced ? 0 : 0.35,
        delay: reduced ? 0 : index * 0.06,
        ease: 'easeOut',
      }}
      whileHover={reduced ? {} : { scale: isBanner ? 1.03 : 1.06 }}
    >
      {hasImage ? (
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
            className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/20 to-transparent p-1.5 sm:p-2"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
          >
            {letter.meta ? (
              <>
                <p
                  className={cn(
                    'truncate leading-tight font-semibold text-white',
                    isBanner ? 'text-[10px] sm:text-xs' : 'text-[9px]'
                  )}
                >
                  {letter.meta.location}
                </p>
                <p
                  className={cn(
                    'font-mono leading-tight text-white/70',
                    isBanner ? 'text-[8px] sm:text-[9px]' : 'text-[7.5px]'
                  )}
                >
                  {formatCoords(letter.meta.lat, letter.meta.lon)}
                </p>
                <Badge
                  variant="outline"
                  className={cn(
                    'mt-0.5 border-white/30 bg-black/40 text-white/80',
                    isBanner ? 'h-4 px-1.5 text-[8px]' : 'h-3.5 px-1 text-[7px]'
                  )}
                >
                  {letter.meta.sensor}
                </Badge>
              </>
            ) : (
              <span
                className={cn(
                  'font-mono font-bold text-white',
                  isBanner ? 'text-base sm:text-xl' : 'text-xs'
                )}
              >
                {letter.char.toUpperCase()}
              </span>
            )}
          </motion.div>
        </>
      ) : (
        /* Fallback: styled gradient tile with letter */
        <div className="from-surface-2 to-surface relative flex h-full w-full items-center justify-center bg-gradient-to-br">
          <span
            className={cn(
              'font-display text-text-muted/40 font-bold tracking-tight select-none',
              isBanner ? 'text-6xl sm:text-7xl md:text-8xl lg:text-9xl' : 'text-2xl'
            )}
          >
            {letter.char === ' ' ? ' ' : letter.char.toUpperCase()}
          </span>
          {isBanner && (
            <div className="from-accent/5 absolute inset-0 bg-gradient-to-tr to-transparent" />
          )}
        </div>
      )}
    </motion.figure>
  )
}

function SkeletonTile({ variant = 'tiles' }: { variant?: 'tiles' | 'banner' }) {
  return (
    <div
      className={cn(
        'bg-surface-2 animate-pulse',
        variant === 'banner'
          ? 'h-24 min-w-0 flex-1 rounded-sm sm:h-32 md:h-40 lg:h-48'
          : 'h-[72px] w-[58px] shrink-0 rounded-lg sm:h-[88px] sm:w-[70px]'
      )}
    />
  )
}

export function LandsatName({
  name = 'SOUHARD',
  mode = 'static',
  variant = 'tiles',
  className,
}: Props) {
  const reduced = useReducedMotion()
  const [query, setQuery] = useState(name)
  const [letters, setLetters] = useState<LetterResult[] | null>(null)
  const [loading, setLoading] = useState(true)

  // Static mode: fetch on mount.
  useEffect(() => {
    if (mode !== 'static') return
    let cancelled = false
    void (async () => {
      if (!name.trim()) return
      await Promise.resolve()
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

  // Interactive mode: debounced fetch.
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

  const displayLetters =
    letters?.filter((l) => l.char !== ' ') ??
    // On fetch error in static mode, synthesise fallback letters so the banner still renders
    (mode === 'static' && !loading
      ? name
          .replace(/\s/g, '')
          .split('')
          .map((char) => ({ char, url: null, meta: null }))
      : null)

  const isBanner = variant === 'banner'
  const letterCount = mode === 'static' ? name.replace(/\s/g, '').length : 6

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

      <div className={cn(isBanner ? 'flex w-full gap-1 sm:gap-1.5' : 'flex flex-wrap gap-1.5')}>
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              className={cn(isBanner ? 'flex w-full gap-1 sm:gap-1.5' : 'flex flex-wrap gap-1.5')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {Array.from({ length: letterCount }).map((_, i) => (
                <SkeletonTile key={i} variant={variant} />
              ))}
            </motion.div>
          ) : displayLetters && displayLetters.length > 0 ? (
            <motion.div
              key="letters"
              className={cn(isBanner ? 'flex w-full gap-1 sm:gap-1.5' : 'flex flex-wrap gap-1.5')}
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
                  variant={variant}
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
