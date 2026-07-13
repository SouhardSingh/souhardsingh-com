'use client'

import { useState } from 'react'
import { KonamiListener } from './KonamiListener'
import { DevConsoleArt } from './DevConsoleArt'
import { CometGame } from '@/components/games/CometGame'

export function EasterEggs() {
  const [gameOpen, setGameOpen] = useState(false)

  return (
    <>
      <KonamiListener onTrigger={() => setGameOpen(true)} />
      <DevConsoleArt />
      <CometGame variant="overlay" open={gameOpen} onClose={() => setGameOpen(false)} />
    </>
  )
}
