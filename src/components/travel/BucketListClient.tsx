'use client'

import dynamic from 'next/dynamic'
import type { Destination } from '@/types'

const BucketList = dynamic(() => import('./BucketList').then((m) => ({ default: m.BucketList })), {
  ssr: false,
})

interface Props {
  destinations: Destination[]
}

export function BucketListClient({ destinations }: Props) {
  return <BucketList destinations={destinations} />
}
