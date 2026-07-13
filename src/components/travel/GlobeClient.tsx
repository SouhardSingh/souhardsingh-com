'use client'

import dynamic from 'next/dynamic'
import type { Destination } from '@/types'

const Globe = dynamic(() => import('./Globe').then((m) => ({ default: m.Globe })), {
  ssr: false,
  loading: () => (
    <div className="mx-auto flex flex-col items-center">
      <div className="bg-surface-2 aspect-square w-full max-w-[560px] animate-pulse rounded-full" />
    </div>
  ),
})

interface Props {
  destinations: Destination[]
}

export function GlobeClient({ destinations }: Props) {
  return <Globe destinations={destinations} />
}
