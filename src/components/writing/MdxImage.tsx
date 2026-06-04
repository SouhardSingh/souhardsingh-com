'use client'

import { useState } from 'react'
import { ImageOffIcon } from 'lucide-react'

interface Props {
  src?: string
  alt?: string
}

/**
 * Client component for inline MDX images (![alt](src) syntax).
 * Uses plain <img> — next/image requires known dimensions that MDX authors shouldn't track.
 * R2 and /public/ paths both work; lazy loading + CDN edge handle optimization.
 */
export function MdxImage({ src, alt }: Props) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  if (!src) return null

  return (
    <figure className="my-8">
      {errored ? (
        <div className="border-border bg-surface-2 flex h-48 w-full items-center justify-center rounded-xl border">
          <ImageOffIcon className="text-text-muted" size={24} />
        </div>
      ) : (
        <div className="relative">
          {!loaded && <div className="bg-surface-2 absolute inset-0 animate-pulse rounded-xl" />}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt ?? ''}
            loading="lazy"
            decoding="async"
            className={`border-border w-full rounded-xl border object-cover shadow-sm transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setLoaded(true)}
            onError={() => setErrored(true)}
          />
        </div>
      )}
      {alt && !errored && (
        <figcaption className="text-text-muted mt-2 text-center text-sm italic">{alt}</figcaption>
      )}
    </figure>
  )
}
