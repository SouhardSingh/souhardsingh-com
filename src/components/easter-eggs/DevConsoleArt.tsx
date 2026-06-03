'use client'

import { useEffect } from 'react'

export function DevConsoleArt() {
  useEffect(() => {
    console.log(
      '%c  Souhard Singh  ',
      'background: #2C1810; color: #D4A853; font-size: 14px; font-weight: bold; padding: 8px 16px; border-radius: 4px;'
    )
    console.log(
      '%cBuilt with Next.js, Tailwind, and way too much coffee ☕',
      'color: #7A6A5F; font-size: 12px;'
    )
  }, [])

  return null
}
