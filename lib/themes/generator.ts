/**
 * Server-side theme CSS generator for shadcn/ui compatibility
 * Generates CSS custom properties for ISR and SSG rendering
 */

import { getThemeFontVariables } from '../fonts'
import { AVAILABLE_THEMES, DEFAULT_THEME_ID, type ThemeId } from './themes'

/**
 * Generate shadcn/ui compatible CSS custom properties
 */
export function generateThemeCSS(themeId: ThemeId): string {
  const theme = AVAILABLE_THEMES[themeId]
  const fontVariables = getThemeFontVariables(themeId)

  return `
    :root {
      /* Semantic color tokens for our app */
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.muted};
      --color-text: ${theme.colors.foreground};
      --color-muted: ${theme.colors.secondary};
      --color-border: ${theme.colors.border};
      
      /* Interactive states */
      --color-primary-hover: ${theme.colors.accent};
      --color-secondary-hover: ${theme.colors.secondary};
      
      /* Typography with Next.js optimized fonts */
      --font-heading: ${fontVariables['--font-heading']};
      --font-body: ${fontVariables['--font-body']};
      
      /* shadcn/ui compatibility */
      --background: ${theme.colors.background};
      --foreground: ${theme.colors.foreground};
      --card: ${theme.colors.background};
      --card-foreground: ${theme.colors.foreground};
      --popover: ${theme.colors.background};
      --popover-foreground: ${theme.colors.foreground};
      --primary: ${theme.colors.primary};
      --primary-foreground: #ffffff;
      --secondary: ${theme.colors.secondary};
      --secondary-foreground: ${theme.colors.foreground};
      --muted: ${theme.colors.muted};
      --muted-foreground: ${theme.colors.secondary};
      --accent: ${theme.colors.accent};
      --accent-foreground: #ffffff;
      --destructive: #ef4444;
      --destructive-foreground: #ffffff;
      --border: ${theme.colors.border};
      --input: ${theme.colors.border};
      --ring: ${theme.colors.ring};
      --radius: 0.5rem;
    }
    
    .dark {
      --color-primary: ${theme.colors.primary};
      --color-secondary: #64748b;
      --color-background: #0f172a;
      --color-surface: #1e293b;
      --color-text: #f8fafc;
      --color-muted: #94a3b8;
      --color-border: #334155;
      --color-primary-hover: ${theme.colors.accent};
      --color-secondary-hover: #475569;
      
      --background: #0f172a;
      --foreground: #f8fafc;
      --card: #1e293b;
      --card-foreground: #f8fafc;
      --popover: #1e293b;
      --popover-foreground: #f8fafc;
      --primary: ${theme.colors.primary};
      --primary-foreground: #f8fafc;
      --secondary: #334155;
      --secondary-foreground: #f8fafc;
      --muted: #1e293b;
      --muted-foreground: #94a3b8;
      --accent: ${theme.colors.accent};
      --accent-foreground: #f8fafc;
      --destructive: #ef4444;
      --destructive-foreground: #f8fafc;
      --border: #334155;
      --input: #334155;
      --ring: ${theme.colors.ring};
    }
  `.trim()
}

/**
 * Extract theme ID from tenant configuration
 * Handles both legacy theme format and new theme ID format
 */
export function getThemeFromTenantConfig(tenantConfig: {
  theme?: string | { primary?: string }
}): ThemeId {
  // Handle legacy theme format (object with colors)
  if (tenantConfig?.theme && typeof tenantConfig.theme === 'object') {
    const primaryColor = tenantConfig.theme.primary

    // Map legacy colors to new theme IDs
    switch (primaryColor) {
      case '#dc2626': // Red
        return 'fire'
      case '#2563eb': // Blue
        return 'ocean'
      case '#059669': // Green
        return 'forest'
      default:
        // Fallback to closest match based on color
        if (primaryColor?.includes('red') || primaryColor?.includes('#dc'))
          return 'fire'
        if (primaryColor?.includes('green') || primaryColor?.includes('#05'))
          return 'forest'
        return DEFAULT_THEME_ID
    }
  }

  // Handle new theme format (string theme ID)
  if (tenantConfig?.theme && typeof tenantConfig.theme === 'string') {
    const themeId = tenantConfig.theme as ThemeId
    return AVAILABLE_THEMES[themeId] ? themeId : DEFAULT_THEME_ID
  }

  // Default fallback
  return DEFAULT_THEME_ID
}

/**
 * Get theme CSS for a specific tenant configuration
 * Convenience function that combines theme resolution and CSS generation
 */
export function generateTenantThemeCSS(tenantConfig: {
  theme?: string | { primary?: string }
}): string {
  const themeId = getThemeFromTenantConfig(tenantConfig)
  return generateCompleteThemeCSS(themeId)
}

/**
 * Generate complete theme CSS (Next.js fonts are handled separately)
 */
export function generateCompleteThemeCSS(themeId: ThemeId): string {
  return generateThemeCSS(themeId)
}

/**
 * Generate theme CSS variables as object for dynamic injection
 */
export function generateThemeCSSVariables(
  themeId: ThemeId,
): Record<string, string> {
  const theme = AVAILABLE_THEMES[themeId]
  const fontVariables = getThemeFontVariables(themeId)

  return {
    // Semantic color tokens for our app
    '--color-primary': theme.colors.primary,
    '--color-secondary': theme.colors.secondary,
    '--color-background': theme.colors.background,
    '--color-surface': theme.colors.muted,
    '--color-text': theme.colors.foreground,
    '--color-muted': theme.colors.secondary,
    '--color-border': theme.colors.border,
    '--color-primary-hover': theme.colors.accent,
    '--color-secondary-hover': theme.colors.secondary,

    // Typography with Next.js optimized fonts
    '--font-heading': fontVariables['--font-heading'],
    '--font-body': fontVariables['--font-body'],

    // shadcn/ui compatibility
    '--background': theme.colors.background,
    '--foreground': theme.colors.foreground,
    '--card': theme.colors.background,
    '--card-foreground': theme.colors.foreground,
    '--popover': theme.colors.background,
    '--popover-foreground': theme.colors.foreground,
    '--primary': theme.colors.primary,
    '--primary-foreground': '#ffffff',
    '--secondary': theme.colors.secondary,
    '--secondary-foreground': theme.colors.foreground,
    '--muted': theme.colors.muted,
    '--muted-foreground': theme.colors.secondary,
    '--accent': theme.colors.accent,
    '--accent-foreground': '#ffffff',
    '--destructive': '#ef4444',
    '--destructive-foreground': '#ffffff',
    '--border': theme.colors.border,
    '--input': theme.colors.border,
    '--ring': theme.colors.ring,
    '--radius': '0.5rem',
  }
}
