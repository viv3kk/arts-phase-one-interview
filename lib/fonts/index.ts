/**
 * Next.js Font Optimization for Multi-Tenant System
 * Uses next/font for optimal font loading with theme support
 */

import { DM_Sans, IBM_Plex_Mono, Nunito_Sans, Poppins } from 'next/font/google'
import type { ThemeId } from '../themes/themes'

// ============================================================================
// Font Definitions with Next.js Optimization
// ============================================================================

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
})

export const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-nunito-sans',
  display: 'swap',
  preload: true,
})

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
  preload: true,
})

export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans',
  display: 'swap',
  preload: true,
})

// ============================================================================
// Theme Font Mappings
// ============================================================================

export const THEME_FONTS = {
  ocean: {
    heading: poppins,
    body: nunitoSans,
  },
  fire: {
    heading: poppins,
    body: ibmPlexMono,
  },
  forest: {
    heading: poppins,
    body: dmSans,
  },
} as const

// ============================================================================
// Font Utilities
// ============================================================================

/**
 * Get fonts for a specific theme
 */
export function getThemeFonts(themeId: ThemeId) {
  return THEME_FONTS[themeId]
}

/**
 * Get combined font class names for a theme
 */
export function getThemeFontClassNames(themeId: ThemeId): string {
  const fonts = getThemeFonts(themeId)
  return `${fonts.heading.variable} ${fonts.body.variable}`
}

/**
 * Get all font variables as CSS custom properties
 */
export function getAllFontVariables(): string {
  return [poppins.variable, nunitoSans.variable, dmSans.variable].join(' ')
}

/**
 * Get font CSS variables for a theme
 */
export function getThemeFontVariables(
  themeId: ThemeId,
): Record<string, string> {
  const fonts = getThemeFonts(themeId)

  return {
    '--font-heading': fonts.heading.style.fontFamily,
    '--font-body': fonts.body.style.fontFamily,
  }
}

// ============================================================================
// Export Types
// ============================================================================

export type ThemeFonts = (typeof THEME_FONTS)[ThemeId]
export type FontFamily = 'poppins' | 'nunito-sans' | 'dm-sans'
