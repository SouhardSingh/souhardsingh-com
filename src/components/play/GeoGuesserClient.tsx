'use client'

import dynamic from 'next/dynamic'

const GeoGuesser = dynamic(() => import('./GeoGuesser').then((m) => ({ default: m.GeoGuesser })), {
  ssr: false,
  loading: () => (
    <div className="mx-auto max-w-3xl">
      <div className="bg-surface-2 aspect-[16/9] w-full animate-pulse rounded-xl" />
      <div className="bg-surface-2 mt-4 aspect-[2/1] w-full animate-pulse rounded-xl" />
    </div>
  ),
})

export function GeoGuesserClient() {
  return <GeoGuesser />
}
