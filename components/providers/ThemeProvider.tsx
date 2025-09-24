'use client'

/**
 * Simplified ThemeProvider for 3 predefined themes
 * Uses server-side CSS injection with minimal client-side logic
 */

import {
  AVAILABLE_THEMES,
  DEFAULT_THEME_ID,
  type Theme,
  type ThemeId,
} from '@/lib/themes'
import React, { createContext, useContext } from 'react'
import { useTenant } from './TenantProvider'

interface ThemeContextType {
  theme: Theme
  themeId: ThemeId
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { config } = useTenant()

  // Extract theme ID from config (supports both legacy and new format)
  let themeId: ThemeId = DEFAULT_THEME_ID

  if (config?.theme) {
    if (typeof config.theme === 'string') {
      // New format: theme ID string
      themeId =
        (config.theme as ThemeId) in AVAILABLE_THEMES
          ? (config.theme as ThemeId)
          : DEFAULT_THEME_ID
    } else if (typeof config.theme === 'object') {
      // Legacy format: theme object with colors - map to closest theme
      const primaryColor = config.theme.primary
      if (primaryColor === '#dc2626') themeId = 'fire'
      else if (primaryColor === '#059669') themeId = 'forest'
      else themeId = 'ocean'
    }
  }

  const theme = AVAILABLE_THEMES[themeId]

  return (
    <ThemeContext.Provider value={{ theme, themeId }}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * Hook to access current theme
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}

/**
 * Hook to get current theme colors (for legacy compatibility)
 */
export function useAppliedTheme() {
  const { theme } = useTheme()
  return {
    primary: theme.colors.primary,
    secondary: theme.colors.secondary,
    background: theme.colors.background,
    text: theme.colors.foreground,
    accent: theme.colors.accent,
    muted: theme.colors.muted,
    border: theme.colors.border,
    ring: theme.colors.ring,
  }
}

/**
 * Hook for theme validation (for legacy compatibility)
 * Since we use predefined themes, validation always passes
 */
export function useThemeValidation() {
  const { theme } = useTheme()
  return {
    isValid: true,
    errors: [],
    validatedTheme: {
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      background: theme.colors.background,
      text: theme.colors.foreground,
    },
  }
}
