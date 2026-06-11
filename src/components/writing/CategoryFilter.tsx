'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { value: '', label: 'all' },
  { value: 'engineering', label: 'engineering' },
  { value: 'travel', label: 'travel' },
  { value: 'life', label: 'life' },
  { value: 'culture', label: 'culture' },
]

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get('cat') ?? ''

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('cat', value)
    } else {
      params.delete('cat')
    }
    router.push(`?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter posts by category">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => handleChange(cat.value)}
          aria-pressed={current === cat.value}
          className={cn(
            'min-h-[44px] rounded-full border px-4 py-2 text-sm font-medium transition-colors',
            current === cat.value
              ? 'bg-accent text-bg border-accent'
              : 'border-border text-text-muted hover:border-text-muted hover:text-text'
          )}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
