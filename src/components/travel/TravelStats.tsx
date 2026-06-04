import type { Destination } from '@/types'

interface Props {
  destinations: Destination[]
}

export function TravelStats({ destinations }: Props) {
  const visited = destinations.filter((d) => d.status === 'visited')
  const continents = new Set(visited.map((d) => d.continent)).size
  const wishlist = destinations.filter((d) => d.status === 'wishlist').length

  const stats = [
    { value: visited.length, label: 'countries visited' },
    { value: continents, label: 'continents' },
    { value: wishlist, label: 'on the list' },
  ]

  return (
    <div className="border-border mx-auto my-10 max-w-5xl divide-x border-y px-4 sm:px-6">
      <div className="divide-border grid grid-cols-3 divide-x">
        {stats.map((s) => (
          <div key={s.label} className="px-4 py-6 text-center sm:px-8">
            <p className="font-display text-text text-3xl font-bold sm:text-4xl">{s.value}</p>
            <p className="text-text-muted mt-1 text-xs font-medium tracking-wide sm:text-sm">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
