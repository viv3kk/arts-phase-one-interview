# Quick Reference Guide

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🌐 Access Tenants

| URL                                | Theme          | Use Case          |
| ---------------------------------- | -------------- | ----------------- |
| `http://localhost:3001`            | Ocean (Blue)   | Default/Corporate |
| `http://abc-rental.localhost:3001` | Fire (Red)     | Bold/Automotive   |
| `http://xyz-rental.localhost:3001` | Forest (Green) | Eco/Natural       |

## 🎨 Theme System

### Using Semantic Classes

```tsx
// ✅ Automatic theme adaptation
<button className="bg-primary text-primary-foreground">
  Primary Button
</button>

// ✅ shadcn/ui components
<Button>Themed Button</Button>
<Card>Themed Card</Card>
```

### Available Themes

```typescript
'ocean' // #2563eb (Blue) - Professional, trustworthy
'fire' // #dc2626 (Red) - Bold, energetic
'forest' // #059669 (Green) - Natural, sustainable
```

### Access Theme in Components

```tsx
import { useAppliedTheme } from '@/components/providers/ThemeProvider'

function MyComponent() {
  const theme = useAppliedTheme()
  return <div style={{ color: theme.primary }}>Themed!</div>
}
```

## 🏗️ Rendering Strategies

### Quick Decision Guide

```tsx
// SSG - Static content
export default function AboutPage() {
  return <StaticContent />
}

// ISR - Content that changes periodically
export const revalidate = 3600 // 1 hour
export default function ProductsPage() {
  return <SemiStaticContent />
}

// SSR - User-specific content
import { headers } from 'next/headers'
export default async function DashboardPage() {
  const userId = (await headers()).get('x-user-id')
  return <DynamicContent userId={userId} />
}
```

## 🧩 UI Components

### Essential Components

```tsx
// Buttons
<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>

// Cards
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Forms
<Label htmlFor="email">Email</Label>
<Input id="email" placeholder="Enter email" />

// Status
<Badge>Status</Badge>
<Badge variant="outline">Outline</Badge>
```

### Custom Components

```tsx
// Call-to-action buttons
<ActionButtons
  primaryText="Get Started"
  secondaryText="Learn More"
/>

// Hero section
<HeroSection
  headline="Your Amazing Service"
  description="Transform your business"
/>

// Theme showcase
<ThemeDemo showValidation={true} />
```

## 📁 File Structure

```
app/
├── layout.tsx           # Theme injection
├── page.tsx            # Main page (ISR)
├── globals.css         # Tailwind + shadcn/ui
└── api/revalidate/     # Cache invalidation

components/
├── providers/          # Theme & tenant context
└── ui/                # shadcn/ui components

config/
├── tenants.json       # Tenant registry
└── tenants/           # Individual configs

lib/
├── themes/            # Theme definitions
├── types/             # TypeScript types
└── utils/             # Helper functions
```

## 🔧 Common Tasks

### Add New Tenant

1. Create config file:

```json
// config/tenants/new-tenant.json
{
  "id": "new-tenant",
  "name": "New Tenant",
  "theme": "ocean",
  "content": {
    "hero": {
      "headline": "New Tenant Headline",
      "description": "New tenant description"
    }
  }
}
```

2. Add to registry:

```json
// config/tenants.json
{
  "tenants": [
    {
      "id": "new-tenant",
      "configFile": "new-tenant.json",
      "domains": ["new-tenant.localhost", "new-tenant.com"]
    }
  ]
}
```

### Add New Theme

1. Define theme:

```typescript
// lib/themes/themes.ts
export const AVAILABLE_THEMES = {
  purple: {
    id: 'purple',
    name: 'Purple Power',
    colors: {
      primary: '#7c3aed', // Purple-600
      // ... other colors
    },
  },
}
```

2. Update types:

```typescript
// lib/types/tenant.ts
export type TenantThemeId = 'ocean' | 'fire' | 'forest' | 'purple'
```

### Trigger Cache Revalidation

```bash
# Revalidate specific path
curl -X POST "http://localhost:3001/api/revalidate?path=/&secret=dev-secret"

# Revalidate by tag
curl -X POST "http://localhost:3001/api/revalidate?tag=products&secret=dev-secret"
```

### Debug Theme Issues

1. Check CSS injection:

```bash
curl "http://tenant.localhost:3001" | grep -A 10 ":root"
```

2. Verify tenant detection:

```bash
curl -H "Host: tenant.localhost" "http://localhost:3001" -I
```

3. Test theme provider:

```tsx
import { useAppliedTheme } from '@/components/providers/ThemeProvider'

function DebugTheme() {
  const theme = useAppliedTheme()
  console.log('Current theme:', theme)
  return <pre>{JSON.stringify(theme, null, 2)}</pre>
}
```

## 🐛 Troubleshooting

### Theme Not Applying

- ✅ Check tenant config has valid theme ID
- ✅ Verify middleware sets `x-tenant-id` header
- ✅ Ensure theme CSS is injected in layout

### Components Not Themed

- ✅ Use semantic classes (`bg-primary` not `bg-blue-600`)
- ✅ Import shadcn/ui components correctly
- ✅ Check CSS custom properties are generated

### Build Errors

- ✅ Run `npm run build` to check for TypeScript errors
- ✅ Run `npx eslint . --fix` for linting issues
- ✅ Clear `.next` folder and restart

### Performance Issues

- ✅ Check ISR revalidation times are appropriate
- ✅ Monitor cache hit rates
- ✅ Use SSG for truly static content

## 📚 Documentation Links

- **[Theme System](./THEME-SYSTEM.md)** - Complete theming guide
- **[UI Components](./UI-COMPONENTS.md)** - Component usage and examples
- **[Rendering Strategies](./RENDERING-STRATEGIES.md)** - SSG/ISR/SSR guide
- **[Architecture Overview](./ARCHITECTURE-OVERVIEW.md)** - System architecture

## 🔗 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run lint            # Run ESLint
npm run type-check      # TypeScript check

# Testing
curl "http://localhost:3001"                    # Test default
curl "http://abc-rental.localhost:3001"         # Test Fire theme
curl "http://xyz-rental.localhost:3001"         # Test Forest theme

# Revalidation
curl -X POST "http://localhost:3001/api/revalidate?path=/&secret=dev-secret"
```
