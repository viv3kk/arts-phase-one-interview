'use client'

import React from 'react'
import { useRenterProfile } from '../services/hooks'

export function AppInitializationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  // Initialize renter profile data on app startup
  useRenterProfile()

  return <>{children}</>
}
