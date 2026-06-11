import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
      <Skeleton className="mb-3 h-12 w-36" />
      <Skeleton className="mb-10 h-5 w-64" />
      {/* Map */}
      <Skeleton className="h-[420px] w-full rounded-xl" />
      {/* Stat pills */}
      <div className="mt-6 flex gap-2.5">
        <Skeleton className="h-9 w-32 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
        <Skeleton className="h-9 w-28 rounded-full" />
      </div>
      {/* Destination cards */}
      <Skeleton className="mt-14 mb-5 h-6 w-40" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
