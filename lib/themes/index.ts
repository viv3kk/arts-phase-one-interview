/**
 * Theme system exports
 * Centralized exports for the new simplified theme system
 */

// Theme definitions
export {
  AVAILABLE_THEMES,
  DEFAULT_THEME,
  DEFAULT_THEME_ID,
  getAllThemes,
  getTheme,
  isValidThemeId,
  type Theme,
  type ThemeId,
} from './themes'

// CSS generation
export {
  generateTenantThemeCSS,
  generateThemeCSS,
  generateThemeCSSVariables,
  getThemeFromTenantConfig,
} from './generator'
