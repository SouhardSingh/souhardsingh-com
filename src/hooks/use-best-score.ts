'use client'

import { useCallback, useSyncExternalStore } from 'react'

const listeners = new Set<() => void>()

function emit() {
  for (const l of listeners) l()
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  // `storage` only fires for *other* tabs; `emit` covers writes from this one.
  window.addEventListener('storage', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('storage', onChange)
  }
}

/**
 * A high score persisted in localStorage.
 *
 * Backed by useSyncExternalStore so the server snapshot (0) is used during
 * hydration and swapped for the stored value right after — no mount gate, and
 * it stays in sync across tabs.
 */
export function useBestScore(key: string) {
  const best = useSyncExternalStore(
    subscribe,
    () => Number(window.localStorage.getItem(key) ?? 0),
    () => 0
  )

  const submit = useCallback(
    (score: number) => {
      if (score <= Number(window.localStorage.getItem(key) ?? 0)) return
      window.localStorage.setItem(key, String(score))
      emit()
    },
    [key]
  )

  return { best, submit }
}
