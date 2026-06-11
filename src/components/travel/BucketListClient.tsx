'use client'

import dynamic from 'next/dynamic'
import type { Destination } from '@/types'

const BucketList = dynamic(() => import('./BucketList').then((m) => ({ default: m.BucketList })), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="bg-surface-2 mb-6 h-6 w-32 animate-pulse rounded-md" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-surface-2 h-14 animate-pulse rounded-xl" />
        ))}
      </div>
    </div>
  ),
})

interface Props {
  destinations: Destination[]
}

export function BucketListClient({ destinations }: Props) {
  return <BucketList destinations={destinations} />
}
