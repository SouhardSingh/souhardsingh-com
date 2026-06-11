'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useReducedMotion } from 'framer-motion'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const CursorTrail = dynamic(
  () => import('./CursorTrail').then((m) => ({ default: m.CursorTrail })),
  { ssr: false }
)

const LandsatName = dynamic(
  () => import('@/components/landsat/LandsatName').then((m) => ({ default: m.LandsatName })),
  { ssr: false }
)

const ORBS = [
  { top: '15%', left: '10%', size: 420 },
  { top: '55%', left: '68%', size: 320 },
  { top: '30%', left: '82%', size: 260 },
]

export function Hero() {
  const reduced = useReducedMotion()

  return (
    <section className="relative flex min-h-[calc(68dvh-3.5rem)] items-center overflow-hidden px-4 sm:px-6">
      {!reduced &&
        ORBS.map((orb, i) => (
          <motion.div
            key={i}
            className="bg-accent/20 pointer-events-none absolute rounded-full blur-3xl"
            style={{ width: orb.size, height: orb.size, top: orb.top, left: orb.left }}
            animate={{ scale: [1, 1.18, 1], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 7, delay: i * 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <motion.h1
          className="font-display text-text text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          initial={reduced ? {} : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Souhard Singh
        </motion.h1>

        <motion.p
          className="text-text-muted mt-5 max-w-lg text-lg sm:text-xl"
          initial={reduced ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Software engineer, writer, and traveler. Building things on the internet.
        </motion.p>

        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.18 }}
          className="mt-6"
        >
          <LandsatName name="SOUHARD" mode="static" />
        </motion.div>

        <motion.div
          className="mt-8 flex flex-wrap gap-3"
          initial={reduced ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.28 }}
        >
          <Link
            href="/work/projects"
            className={cn(buttonVariants({ size: 'lg' }), 'min-h-[44px] px-6')}
          >
            See my work
          </Link>
          <Link
            href="/writing/blog"
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'min-h-[44px] px-6')}
          >
            Read
          </Link>
        </motion.div>
      </div>

      <CursorTrail />
    </section>
  )
}
