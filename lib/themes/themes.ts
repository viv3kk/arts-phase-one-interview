/**
 * Theme definitions for multi-tenant theming system
 * 3 predefined themes with shadcn/ui compatible colors
 */

export type ThemeId = 'ocean' | 'fire' | 'forest'

export interface Theme {
  id: ThemeId
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    foreground: string
    muted: string
    border: string
    ring: string
  }
  fonts: {
    heading: string
    body: string
  }
  preview: string
}

export const AVAILABLE_THEMES: Record<ThemeId, Theme> = {
  ocean: {
    id: 'ocean',
    name: 'Ocean Blue',
    description:
      'Professional and trustworthy - perfect for established businesses',
    colors: {
      primary: '#2563eb', // Blue-600
      secondary: '#64748b', // Slate-500
      accent: '#0ea5e9', // Sky-500
      background: '#ffffff', // White
      foreground: '#0f172a', // Slate-900
      muted: '#f1f5f9', // Slate-100
      border: '#e2e8f0', // Slate-200
      ring: '#2563eb', // Blue-600
    },
    fonts: {
      heading: 'Poppins',
      body: 'Nunito Sans',
    },
    preview: '/themes/ocean-preview.png',
  },
  fire: {
    id: 'fire',
    name: 'Fire Red',
    description: 'Bold and energetic - great for dynamic startups',
    colors: {
      primary: '#dc2626', // Red-600
      secondary: '#6b7280', // Gray-500
      accent: '#f59e0b', // Amber-500
      background: '#ffffff', // White
      foreground: '#111827', // Gray-900
      muted: '#f9fafb', // Gray-50
      border: '#d1d5db', // Gray-300
      ring: '#dc2626', // Red-600
    },
    fonts: {
      heading: 'Poppins',
      body: 'IBM Plex Mono',
    },
    preview: '/themes/fire-preview.png',
  },
  forest: {
    id: 'forest',
    name: 'Forest Green',
    description: 'Natural and eco-friendly - ideal for sustainable businesses',
    colors: {
      primary: '#059669', // Emerald-600
      secondary: '#6b7280', // Gray-500
      accent: '#10b981', // Emerald-500
      background: '#ffffff', // White
      foreground: '#111827', // Gray-900
      muted: '#f0fdf4', // Green-50
      border: '#d1fae5', // Green-200
      ring: '#059669', // Emerald-600
    },
    fonts: {
      heading: 'Poppins',
      body: 'DM Sans',
    },
    preview: '/themes/forest-preview.png',
  },
}

// Default theme (Ocean)
export const DEFAULT_THEME_ID: ThemeId = 'ocean'
export const DEFAULT_THEME = AVAILABLE_THEMES[DEFAULT_THEME_ID]

/**
 * Get theme by ID with fallback to default
 */
export function getTheme(themeId?: string): Theme {
  if (themeId && themeId in AVAILABLE_THEMES) {
    return AVAILABLE_THEMES[themeId as ThemeId]
  }
  return DEFAULT_THEME
}

/**
 * Validate if a theme ID is valid
 */
export function isValidThemeId(themeId: string): themeId is ThemeId {
  return themeId in AVAILABLE_THEMES
}

/**
 * Get all available theme options
 */
export function getAllThemes(): Theme[] {
  return Object.values(AVAILABLE_THEMES)
}
