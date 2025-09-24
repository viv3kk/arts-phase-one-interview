/**
 * Hook for tracking hydration state across stores
 * Used to prevent hydration mismatches in SSR/SSG
 */
'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to check if the client has hydrated
 * Used to prevent hydration mismatches and show loading states
 */
export const useHydration = () => {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setHydrated(true)
  }, [])

  return hydrated
}

/**
 * Hook variant that accepts a store's persist API
 * for more specific hydration tracking
 */
export function useStoreHydration(persistAPI?: {
  hasHydrated: () => boolean
  onHydrate?: (_fn: () => void) => () => void
  onFinishHydration?: (_fn: () => void) => () => void
}) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    if (!persistAPI) {
      setHydrated(true)
      return
    }

    // Subscribe to store hydration events
    const unsubHydrate = persistAPI.onHydrate?.(() => setHydrated(false))
    const unsubFinishHydration = persistAPI.onFinishHydration?.(() =>
      setHydrated(true),
    )

    // Check if already hydrated
    setHydrated(persistAPI.hasHydrated())

    return () => {
      unsubHydrate?.()
      unsubFinishHydration?.()
    }
  }, [persistAPI])

  return hydrated
}
