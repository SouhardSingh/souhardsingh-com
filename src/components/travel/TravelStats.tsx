import { GlobeIcon, HeartIcon, MapIcon } from 'lucide-react'
import type { Destination } from '@/types'

interface Props {
  destinations: Destination[]
}

export function TravelStats({ destinations }: Props) {
  const visited = destinations.filter((d) => d.status === 'visited')
  const continents = new Set(visited.map((d) => d.continent)).size
  const wishlist = destinations.filter((d) => d.status === 'wishlist').length

  const stats = [
    { value: visited.length, label: 'countries', Icon: GlobeIcon },
    { value: continents, label: 'continents', Icon: MapIcon },
    { value: wishlist, label: 'on the list', Icon: HeartIcon },
  ]

  return (
    <div className="mx-auto mt-6 flex max-w-5xl flex-wrap gap-2.5 px-4 sm:px-6">
      {stats.map(({ value, label, Icon }) => (
        <div
          key={label}
          className="border-border bg-surface-2 flex items-center gap-2 rounded-full border px-4 py-2"
        >
          <Icon size={14} className="text-accent shrink-0" />
          <span className="text-text text-sm font-semibold">{value}</span>
          <span className="text-text-muted text-xs">{label}</span>
        </div>
      ))}
    </div>
  )
}
