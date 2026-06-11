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

      // Absolute positions of the article in the document
      const absTop = top + window.scrollY
      const absBottom = absTop + height

      // 0% when article top reaches viewport top; 100% when article bottom reaches viewport bottom
      const start = absTop
      const end = absBottom - windowH

      if (end <= start) {
        // Article shorter than viewport — always fully visible
        setProgress(100)
        return
      }

      const raw = ((window.scrollY - start) / (end - start)) * 100
      setProgress(Math.min(100, Math.max(0, raw)))
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
