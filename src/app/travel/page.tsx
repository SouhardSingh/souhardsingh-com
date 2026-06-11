import type { Metadata } from 'next'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { TravelStats } from '@/components/travel/TravelStats'
import { WorldMapClient } from '@/components/travel/WorldMapClient'
import { DestinationCard } from '@/components/travel/DestinationCard'
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
  const visited = destinations.filter((d) => d.status === 'visited')
  const wishlist = destinations.filter((d) => d.status === 'wishlist')

  return (
    <PageWrapper>
      <div className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
        <h1 className="font-display text-text text-4xl font-bold tracking-tight sm:text-5xl">
          Travel
        </h1>
        <p className="text-text-muted mt-4 max-w-xl text-lg">Places visited, places dreamed of.</p>
      </div>

      {/* World map */}
      <div className="mt-10 px-4 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <WorldMapClient destinations={destinations} />
        </div>
      </div>

      {/* Stat pills */}
      <TravelStats destinations={destinations} />

      {/* Visited destinations */}
      {visited.length > 0 && (
        <section className="mx-auto mt-14 max-w-5xl px-4 sm:px-6">
          <h2 className="text-text mb-5 text-lg font-semibold">Places I&apos;ve been</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {visited.map((d) => (
              <DestinationCard key={d.slug} destination={d} mode="visited" />
            ))}
          </div>
        </section>
      )}

      {/* Wishlist */}
      {wishlist.length > 0 && (
        <section className="mx-auto mt-12 max-w-5xl px-4 pb-16 sm:px-6">
          <h2 className="text-text mb-5 text-lg font-semibold">Wish list</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {wishlist.map((d) => (
              <DestinationCard key={d.slug} destination={d} mode="wishlist" />
            ))}
          </div>
        </section>
      )}
    </PageWrapper>
  )
}
