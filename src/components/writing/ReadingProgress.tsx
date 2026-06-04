'use client'

import { useEffect, useState } from 'react'

export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const article = document.querySelector('article')
    if (!article) return

    const update = () => {
      const { top, height } = article.getBoundingClientRect()
      const windowH = window.innerHeight
      const scrolled = Math.max(0, windowH - top)
      const pct = Math.min(100, (scrolled / (height + windowH)) * 100)
      setProgress(pct)
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div
      className="bg-accent fixed top-0 left-0 z-50 h-0.5 transition-[width] duration-75"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
    />
  )
}
