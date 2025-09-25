# Theme System Documentation

## Overview

This multi-tenant storefront uses a sophisticated theme system that combines predefined themes with shadcn/ui components and Tailwind CSS v4. Each tenant can have their own branded experience through dynamic theme switching.

## Architecture

### Theme Structure

```typescript
interface Theme {
  id: string
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
  preview: string
}
```

### Available Themes

#### 🌊 Ocean Theme (Default)

- **Primary**: `#2563eb` (Blue-600)
- **Use Case**: Professional businesses, tech companies, corporate sites
- **Feel**: Trustworthy, established, reliable

#### 🔥 Fire Theme

- **Primary**: `#dc2626` (Red-600)
- **Use Case**: Bold brands, sports, automotive, high-energy businesses
- **Feel**: Dynamic, passionate, attention-grabbing

#### 🌲 Forest Theme

- **Primary**: `#059669` (Emerald-600)
- **Use Case**: Eco-friendly, health, nature-related businesses
- **Feel**: Natural, sustainable, calming

## Implementation

### 1. Theme Configuration

Tenants specify their theme in their configuration file:

```json
{
  "id": "abc-rental",
  "name": "InstaShop",
  "theme": "fire",
  "content": {
    // ... tenant content
  }
}
```

### 2. Server-Side Theme Injection

Themes are injected server-side in `app/layout.tsx` to prevent FOUC (Flash of Unstyled Content):

```tsx
// app/layout.tsx
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  const themeCSS = await generateTenantThemeCSS(tenantId)

  return (
    <html lang='en'>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCSS }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
```

### 3. CSS Custom Properties Generation

The theme system generates CSS custom properties that work with both Tailwind CSS v4 and shadcn/ui:

```css
:root {
  /* Tailwind CSS v4 semantic tokens */
  --color-primary: #dc2626;
  --color-secondary: #6b7280;
  --color-background: #ffffff;

  /* shadcn/ui compatibility */
  --primary: #dc2626;
  --secondary: #6b7280;
  --background: #ffffff;
  --foreground: #111827;
}
```

### 4. Client-Side Theme Context

The `ThemeProvider` provides theme information to React components:

```tsx
import { useAppliedTheme } from '@/components/providers/ThemeProvider'

function MyComponent() {
  const theme = useAppliedTheme()

  return (
    <div style={{ backgroundColor: theme.primary }}>Dynamic theme color!</div>
  )
}
```

## Usage Guidelines

### Using Semantic Classes

Prefer semantic Tailwind classes that automatically adapt to themes:

```tsx
// ✅ Good - automatically adapts to theme
<button className="bg-primary text-primary-foreground">
  Primary Button
</button>

// ❌ Avoid - hardcoded colors
<button className="bg-red-600 text-white">
  Hardcoded Button
</button>
```

### shadcn/ui Integration

shadcn/ui components automatically use theme colors:

```tsx
import { Button } from '@/components/ui/button'

// Automatically uses theme's primary color
<Button>Primary Action</Button>
<Button variant="outline">Secondary Action</Button>
```

### Available Semantic Classes

| Class                   | CSS Variable         | Purpose               |
| ----------------------- | -------------------- | --------------------- |
| `bg-primary`            | `--color-primary`    | Primary brand color   |
| `text-primary`          | `--color-primary`    | Primary text color    |
| `bg-secondary`          | `--color-secondary`  | Secondary brand color |
| `bg-background`         | `--color-background` | Page background       |
| `text-foreground`       | `--color-foreground` | Primary text          |
| `text-muted-foreground` | `--color-muted`      | Secondary text        |
| `border-border`         | `--color-border`     | Border color          |

## Adding New Themes

### 1. Define Theme Object

Add to `lib/themes/themes.ts`:

```typescript
export const AVAILABLE_THEMES = {
  // ... existing themes
  sunset: {
    id: 'sunset',
    name: 'Sunset Orange',
    description:
      'Warm and inviting - perfect for hospitality and lifestyle brands',
    colors: {
      primary: '#ea580c', // Orange-600
      secondary: '#64748b', // Slate-500
      accent: '#f97316', // Orange-500
      background: '#ffffff',
      foreground: '#0f172a',
      muted: '#f1f5f9',
      border: '#e2e8f0',
      ring: '#ea580c',
    },
    preview: '/themes/sunset-preview.png',
  },
}
```

### 2. Update Type Definitions

Add to `lib/types/tenant.ts`:

```typescript
export type TenantThemeId = 'ocean' | 'fire' | 'forest' | 'sunset'
```

### 3. Update Theme Provider

The theme provider will automatically handle the new theme.

### 4. Test the Theme

Update a tenant configuration to use the new theme:

```json
{
  "theme": "sunset"
}
```

## Theme Validation

The system includes built-in validation for theme colors:

```tsx
import { useThemeValidation } from '@/components/providers/ThemeProvider'

function ThemeStatus() {
  const { isValid, errors } = useThemeValidation()

  if (!isValid) {
    return <div>Theme errors: {errors.join(', ')}</div>
  }

  return <div>Theme is valid ✅</div>
}
```

## Best Practices

### 1. Consistency

- Use semantic classes consistently across components
- Avoid hardcoded colors in favor of theme variables
- Test components with all available themes

### 2. Accessibility

- Ensure sufficient contrast ratios for all theme combinations
- Test with dark mode variants
- Use semantic HTML with proper ARIA labels

### 3. Performance

- Themes are injected server-side to prevent FOUC
- CSS variables are cached and optimized
- Minimal runtime theme switching overhead

### 4. Maintainability

- Keep theme definitions centralized in `lib/themes/`
- Use TypeScript for type safety
- Document theme changes and updates

## Troubleshooting

### Common Issues

#### Theme Not Applying

1. Check tenant configuration has valid theme ID
2. Verify middleware is setting `x-tenant-id` header
3. Ensure theme CSS is being injected in layout

#### Colors Not Updating

1. Check if using semantic classes vs hardcoded colors
2. Verify CSS custom properties are generated correctly
3. Clear browser cache and restart dev server

#### shadcn/ui Components Not Themed

1. Ensure both `--color-*` and `--*` variables are generated
2. Check component is using shadcn/ui classes
3. Verify no CSS conflicts with custom styles

### Debug Commands

```bash
# Check theme generation
curl "http://tenant.localhost:3001" | grep -A 20 ":root"

# Validate tenant config
node scripts/test-tenant-configs.js

# Check middleware
curl -H "Host: tenant.localhost" "http://localhost:3001" -I
```

## Migration Guide

### From Legacy Theme System

If migrating from an older theme system:

1. **Update tenant configs**: Change from theme objects to theme IDs

```json
// Old format
"theme": {
  "primary": "#dc2626",
  "secondary": "#6b7280"
}

// New format
"theme": "fire"
```

2. **Update components**: Replace custom theme hooks with new providers
3. **Test thoroughly**: Verify all themes work across all tenants

### Version Compatibility

- **Tailwind CSS**: v4.0+ required for semantic tokens
- **Next.js**: v15.0+ for server components and headers
- **shadcn/ui**: Latest version recommended
- **React**: v18.0+ for concurrent features
