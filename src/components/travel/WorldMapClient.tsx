'use client'

import dynamic from 'next/dynamic'
import type { Destination } from '@/types'

const WorldMap = dynamic(() => import('./WorldMap').then((m) => ({ default: m.WorldMap })), {
  ssr: false,
  loading: () => <div className="bg-surface-2 h-[420px] w-full animate-pulse rounded-xl" />,
})

interface Props {
  destinations: Destination[]
}

export function WorldMapClient({ destinations }: Props) {
  return <WorldMap destinations={destinations} />
}
