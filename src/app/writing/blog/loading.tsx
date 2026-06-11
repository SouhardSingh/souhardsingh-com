import { Skeleton } from '@/components/ui/skeleton'

function PostCardSkeleton() {
  return (
    <div className="border-border space-y-3 rounded-xl border p-5">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="ml-auto h-4 w-24" />
      </div>
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <Skeleton className="mb-3 h-10 w-40" />
      <Skeleton className="mb-8 h-5 w-72" />
      {/* Filter pill skeletons */}
      <div className="mb-8 flex flex-wrap gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-24 rounded-full" />
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
