import { Skeleton } from '@/components/ui/skeleton'

function ProjectCardSkeleton() {
  return (
    <div className="border-border bg-card overflow-hidden rounded-xl border">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="space-y-2 p-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-3/5" />
          <Skeleton className="ml-auto h-5 w-12 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
        <div className="flex gap-1.5 pt-1">
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <Skeleton className="mb-3 h-10 w-40" />
      <Skeleton className="mb-8 h-5 w-72" />
      <div className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-24 rounded-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
