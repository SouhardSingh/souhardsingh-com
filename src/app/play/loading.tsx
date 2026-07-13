import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-16 sm:px-6">
      <Skeleton className="mb-3 h-12 w-28" />
      <Skeleton className="mb-10 h-5 w-80" />
      <Skeleton className="mb-8 h-8 w-56 rounded-lg" />
      <div className="mx-auto max-w-3xl">
        <Skeleton className="aspect-[16/9] w-full rounded-xl" />
        <Skeleton className="mt-4 aspect-[2/1] w-full rounded-xl" />
      </div>
    </div>
  )
}
