/**
 * Server-side theme utilities for Next.js App Router
 * Handles theme CSS generation for server components and SSR
 * Requirements: 2.1, 2.2, 2.4, 2.5
 */

import React from 'react'
import { generateThemeCSS, getTheme, type ThemeId } from './themes'
import { TenantTheme } from './types/tenant'

/**
 * Generates theme CSS for server-side rendering
 * Can be used in server components to inject theme styles
 */
export function generateServerThemeCSS(theme: TenantTheme): string {
  if (typeof theme === 'string') {
    // New theme format: theme ID
    return generateThemeCSS(theme as ThemeId)
  } else {
    // Legacy theme format: determine closest theme
    const primaryColor = theme.primary
    let themeId: ThemeId = 'ocean'

    if (primaryColor === '#dc2626') themeId = 'fire'
    else if (primaryColor === '#059669') themeId = 'forest'

    return generateThemeCSS(themeId)
  }
}

/**
 * Creates a style element with theme CSS for server-side rendering
 * Returns JSX element that can be included in the document head
 */
export function createThemeStyleElement(
  theme: TenantTheme,
): React.ReactElement {
  const css = generateServerThemeCSS(theme)

  return React.createElement('style', {
    key: 'tenant-theme',
    dangerouslySetInnerHTML: {
      __html: css,
    },
  })
}

/**
 * Validates theme on server-side and returns validation result
 * Useful for server components that need to handle theme validation
 */
export function validateServerTheme(theme: TenantTheme) {
  if (typeof theme === 'string') {
    const validThemeIds = ['ocean', 'fire', 'forest']
    return {
      isValid: validThemeIds.includes(theme),
      errors: validThemeIds.includes(theme) ? [] : ['Invalid theme ID'],
      validatedTheme: getTheme(theme),
    }
  } else {
    // Legacy theme validation
    const errors: string[] = []
    if (!theme.primary) errors.push('Missing primary color')
    if (!theme.secondary) errors.push('Missing secondary color')
    if (!theme.background) errors.push('Missing background color')
    if (!theme.text) errors.push('Missing text color')

    return {
      isValid: errors.length === 0,
      errors,
      validatedTheme: getTheme(), // Returns default theme
    }
  }
}

/**
 * Gets theme CSS properties as an object for inline styles
 * Useful for server components that need to apply styles directly
 */
export function getThemeInlineStyles(theme: TenantTheme): React.CSSProperties {
  const { validatedTheme } = validateServerTheme(theme)

  return {
    '--color-primary': validatedTheme.colors.primary,
    '--color-secondary': validatedTheme.colors.secondary,
    '--color-background': validatedTheme.colors.background,
    '--color-text': validatedTheme.colors.foreground,
    '--color-foreground': validatedTheme.colors.foreground,
  } as React.CSSProperties
}

/**
 * Creates theme meta tags for better SEO and PWA support
 * Returns array of meta tag objects
 */
export function createThemeMetaTags(theme: TenantTheme): Array<{
  key: string
  name: string
  content: string
}> {
  const { validatedTheme } = validateServerTheme(theme)

  return [
    {
      key: 'theme-color',
      name: 'theme-color',
      content: validatedTheme.colors.primary,
    },
    {
      key: 'msapplication-navbutton-color',
      name: 'msapplication-navbutton-color',
      content: validatedTheme.colors.primary,
    },
    {
      key: 'apple-mobile-web-app-status-bar-style',
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
  ]
}
