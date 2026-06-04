'use client'

import { useState } from 'react'
import NextImage, { type ImageProps } from 'next/image'
import { ImageOffIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CloudImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  /** Extra classes applied to the outer wrapper div */
  wrapperClassName?: string
}

/**
 * Drop-in replacement for next/image that adds:
 * - Animated skeleton while the image is loading
 * - Graceful error state (broken-image icon) when the src fails
 *
 * Use this for any image that might come from R2, CDN, or local /public/.
 * next.config.ts remotePatterns must include the host for external URLs.
 */
export function CloudImage({
  src,
  alt,
  className,
  wrapperClassName,
  fill,
  width,
  height,
  ...props
}: CloudImageProps) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')

  const sizeProps = fill ? { fill: true as const } : { width, height }

  if (status === 'error') {
    return (
      <div
        className={cn(
          'bg-surface-2 border-border flex items-center justify-center rounded-xl border',
          // When used with fill the parent controls dimensions; otherwise use passed dimensions
          !fill && 'overflow-hidden',
          wrapperClassName ?? className
        )}
        style={!fill ? { width, height } : undefined}
        role="img"
        aria-label={`${alt ?? 'Image'} (failed to load)`}
      >
        <ImageOffIcon className="text-text-muted" size={24} />
      </div>
    )
  }

  return (
    <div className={cn('relative overflow-hidden', fill && 'h-full w-full', wrapperClassName)}>
      {/* Skeleton visible while image is still loading */}
      {status === 'loading' && (
        <div className="bg-surface-2 absolute inset-0 animate-pulse rounded-[inherit]" />
      )}

      <NextImage
        src={src}
        alt={alt ?? ''}
        {...sizeProps}
        className={cn(
          'transition-opacity duration-300',
          status === 'loading' ? 'opacity-0' : 'opacity-100',
          className
        )}
        onLoad={() => setStatus('ready')}
        onError={() => setStatus('error')}
        {...props}
      />
    </div>
  )
}
