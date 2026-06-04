'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'travel', label: 'Travel' },
  { value: 'life', label: 'Life' },
  { value: 'culture', label: 'Culture' },
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
    <Tabs value={current} onValueChange={handleChange}>
      <TabsList variant="line" className="h-auto flex-wrap gap-1">
        {CATEGORIES.map((cat) => (
          <TabsTrigger key={cat.value} value={cat.value} className="min-h-[44px] px-4">
            {cat.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
