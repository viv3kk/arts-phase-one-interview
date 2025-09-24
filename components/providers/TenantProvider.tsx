'use client'

/**
 * TenantProvider - React Context Provider for tenant configuration state
 * Provides tenant configuration data to client components
 * Requirements: 2.1, 2.2, 2.3
 */

import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  TenantConfig,
  TenantContext as TenantContextType,
} from '@/lib/types/tenant'

// Create the tenant context
const TenantContext = createContext<TenantContextType | undefined>(undefined)

interface TenantProviderProps {
  children: React.ReactNode
  initialConfig: TenantConfig
}

/**
 * TenantProvider component that provides tenant configuration to child components
 */
export function TenantProvider({
  children,
  initialConfig,
}: TenantProviderProps) {
  const [config, setConfig] = useState<TenantConfig>(initialConfig)
  const [isLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)

  // Update configuration if initialConfig changes
  useEffect(() => {
    setConfig(initialConfig)
    setError(undefined)
  }, [initialConfig])

  const contextValue: TenantContextType = {
    config,
    isLoading,
    error,
  }

  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  )
}

/**
 * Hook to use tenant context in components
 */
export function useTenant(): TenantContextType {
  const context = useContext(TenantContext)

  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }

  return context
}

/**
 * Hook to get tenant configuration directly
 */
export function useTenantConfig(): TenantConfig {
  const { config } = useTenant()
  return config
}

/**
 * Hook to get tenant theme
 */
export function useTenantTheme() {
  const { config } = useTenant()
  return config.theme
}
