'use client'

import { useEffect } from 'react'

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
]

export function KonamiListener() {
  useEffect(() => {
    let idx = 0
    const handler = (e: KeyboardEvent) => {
      if (e.key === KONAMI[idx]) {
        idx++
        if (idx === KONAMI.length) {
          idx = 0
          console.log(
            '%c✨ Konami code! You found a secret.',
            'color: #D4A853; font-size: 16px; font-weight: bold;'
          )
        }
      } else {
        idx = 0
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return null
}
