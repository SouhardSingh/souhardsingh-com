import type { Metadata } from 'next'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { TravelStats } from '@/components/travel/TravelStats'
import { BucketListClient } from '@/components/travel/BucketListClient'
import { WorldMapClient } from '@/components/travel/WorldMapClient'
import rawDestinations from '@content/travel/destinations.json'
import type { Destination } from '@/types'

const destinations = rawDestinations as Destination[]

export const metadata: Metadata = {
  title: 'Travel',
  description: 'Places visited, places dreamed of.',
  openGraph: {
    title: 'Travel',
    description: 'Places visited, places dreamed of.',
    images: ['/og?title=Travel&type=page'],
  },
  twitter: { card: 'summary_large_image' },
}

export default function TravelPage() {
  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <h1 className="font-display text-text text-4xl font-bold tracking-tight sm:text-5xl">
          Travel
        </h1>
        <p className="text-text-muted mt-4 max-w-xl text-lg">Places visited, places dreamed of.</p>
      </div>

      <div className="mt-10 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <WorldMapClient destinations={destinations} />
        </div>
      </div>

      <TravelStats destinations={destinations} />

      <BucketListClient destinations={destinations} />
    </PageWrapper>
  )
}
