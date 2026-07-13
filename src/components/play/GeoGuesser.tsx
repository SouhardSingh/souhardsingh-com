'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { MapPinIcon, LightbulbIcon, SatelliteIcon, TrophyIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { haversineKm, scoreFromDistanceKm } from '@/lib/geo'
import { useBestScore } from '@/hooks/use-best-score'
import type { GeoRound, GuessResult, LatLng } from '@/types'
import rawRounds from '@content/play/geo-rounds.json'
import { GuessMap } from './GuessMap'

const ROUNDS_PER_GAME = 5
const BEST_KEY = 'geo-guesser-best'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function RoundImage({ round }: { round: GeoRound }) {
  const [failed, setFailed] = useState(false)
  if (!round.image || failed) {
    return (
      <div className="bg-surface-2 text-text-muted flex size-full flex-col items-center justify-center gap-2 p-6 text-center">
        <SatelliteIcon size={28} className="opacity-60" />
        <p className="text-xs">Awaiting satellite imagery — read the clue below.</p>
      </div>
    )
  }
  return (
    <Image
      src={round.image}
      alt="Satellite view of a mystery location"
      fill
      sizes="(max-width: 768px) 100vw, 640px"
      className="object-cover"
      onError={() => setFailed(true)}
    />
  )
}

export function GeoGuesser() {
  const reduced = useReducedMotion()
  const [rounds, setRounds] = useState<GeoRound[]>(() =>
    shuffle(rawRounds as GeoRound[]).slice(0, ROUNDS_PER_GAME)
  )
  const [index, setIndex] = useState(0)
  const [guess, setGuess] = useState<LatLng | null>(null)
  const [results, setResults] = useState<GuessResult[]>([])
  const [revealed, setRevealed] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const { best, submit: submitBest } = useBestScore(BEST_KEY)

  const round = rounds[index]
  const total = useMemo(() => results.reduce((s, r) => s + r.points, 0), [results])
  const done = index >= rounds.length

  function submitGuess() {
    if (!guess || !round) return
    const distanceKm = haversineKm(guess, round.answer)
    const points = scoreFromDistanceKm(distanceKm)
    setResults((r) => [...r, { round, guess, distanceKm, points }])
    setRevealed(true)
  }

  function next() {
    const nextIndex = index + 1
    setRevealed(false)
    setShowHint(false)
    setGuess(null)
    setIndex(nextIndex)
    // `total` already includes the round just revealed.
    if (nextIndex >= rounds.length) submitBest(total)
  }

  function playAgain() {
    setRounds(shuffle(rawRounds as GeoRound[]).slice(0, ROUNDS_PER_GAME))
    setResults([])
    setIndex(0)
    setGuess(null)
    setRevealed(false)
    setShowHint(false)
  }

  const last = results[results.length - 1]

  if (done) {
    return (
      <div className="mx-auto max-w-xl">
        <div className="border-border bg-card rounded-2xl border p-6 text-center">
          <TrophyIcon size={28} className="text-accent mx-auto" />
          <h3 className="text-text mt-2 text-2xl font-bold">{total.toLocaleString()} pts</h3>
          <p className="text-text-muted mt-1 text-sm">Personal best: {best.toLocaleString()}</p>
          <ul className="border-border mt-5 divide-y divide-[hsl(var(--border))] border-t text-left text-sm">
            {results.map((r, i) => (
              <li key={i} className="flex items-center justify-between py-2.5">
                <span className="text-text">{r.round.answer.name}</span>
                <span className="text-text-muted text-xs">
                  {Math.round(r.distanceKm).toLocaleString()} km · {r.points.toLocaleString()} pts
                </span>
              </li>
            ))}
          </ul>
          <Button onClick={playAgain} className="mt-5 w-full sm:w-auto">
            Play again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress */}
      <div className="text-text-muted mb-3 flex items-center justify-between text-sm">
        <span>
          Round {index + 1} / {rounds.length}
        </span>
        <span>Total: {total.toLocaleString()} pts</span>
      </div>

      {/* Clue image */}
      <div className="border-border relative aspect-[16/9] w-full overflow-hidden rounded-xl border">
        <RoundImage round={round} />
      </div>

      {/* Hint */}
      <div className="mt-3">
        {showHint || !round.image ? (
          <p className="text-text-muted flex items-start gap-2 text-sm">
            <LightbulbIcon size={15} className="text-accent mt-0.5 shrink-0" />
            {round.hint}
          </p>
        ) : (
          <button
            onClick={() => setShowHint(true)}
            className="text-text-muted hover:text-text inline-flex items-center gap-1.5 text-xs font-medium"
          >
            <LightbulbIcon size={14} /> Need a hint?
          </button>
        )}
      </div>

      {/* Map */}
      <div className="border-border mt-4 overflow-hidden rounded-xl border">
        <GuessMap
          onGuess={setGuess}
          guess={guess}
          actual={revealed ? { ...round.answer } : null}
          disabled={revealed}
        />
      </div>

      {/* Action / reveal */}
      {!revealed ? (
        <div className="mt-4 flex items-center gap-3">
          <Button onClick={submitGuess} disabled={!guess} className="min-h-11">
            <MapPinIcon size={15} /> Submit guess
          </Button>
          <span className="text-text-muted text-xs">
            {guess ? 'Locked in — submit when ready.' : 'Click the map to drop your guess.'}
          </span>
        </div>
      ) : (
        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="border-border bg-card mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border p-4"
        >
          <div>
            <p className="text-text text-sm font-semibold">
              {round.answer.name}, {round.answer.country}
            </p>
            <p className="text-text-muted text-xs">
              {last ? Math.round(last.distanceKm).toLocaleString() : 0} km away
            </p>
          </div>
          <p className="text-accent text-lg font-bold">
            +{last ? last.points.toLocaleString() : 0}
          </p>
          <Button onClick={next} className="ml-auto min-h-11">
            {index + 1 >= rounds.length ? 'See results' : 'Next round'}
          </Button>
        </motion.div>
      )}
    </div>
  )
}
