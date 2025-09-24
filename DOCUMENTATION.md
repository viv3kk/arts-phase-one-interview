# Multi-Tenant Car Rental Storefront Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Architecture](#architecture)
4. [Configuration](#configuration)
5. [Development](#development)
6. [Deployment](#deployment)
7. [Troubleshooting](#troubleshooting)
8. [API Reference](#api-reference)
9. [Contributing](#contributing)
10. [Additional Documentation](#additional-documentation)

---

## 🌟 Overview

The Multi-Tenant Car Rental Storefront is a SaaS platform built with Next.js 15 that allows multiple car rental businesses to have their own branded storefronts while sharing a common codebase and infrastructure.

### Key Features

- **🏢 Multi-Tenancy**: Subdomain-based tenant identification
- **🎨 Dynamic Theming**: Tenant-specific colors, fonts, and branding
- **🔍 SEO Optimized**: Comprehensive SEO with Open Graph, Twitter Cards, and structured data
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS
- **⚡ Performance**: Server-side rendering with static generation
- **🛡️ Type Safety**: Full TypeScript implementation
- **🧪 Testing**: Comprehensive configuration validation

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS v4 with CSS-first configuration
- **Language**: TypeScript
- **Runtime**: React 19
- **Deployment**: Vercel-ready (or any Node.js hosting)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd multi-tenant-storefront
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

4. **Access the application**
   - Default tenant: http://localhost:3000
   - ABC Rentals: http://abc-rentals.localhost:3000
   - XYZ Cars: http://xyz-cars.localhost:3000

### Quick Start Commands

```bash
# Development
npm run dev              # Start development server
npm run dev:turbo        # Start with Turbo (faster)
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues
npm run format           # Format with Prettier
npm run type-check       # TypeScript type checking
npm run validate         # Run all quality checks

# Testing
npm run test:config      # Validate tenant configurations
npm run clean            # Clean build artifacts
```

---

## 🏗️ Architecture

### Project Structure

```
multi-tenant-storefront/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with tenant providers
│   ├── page.tsx                 # Home page
│   ├── globals.css              # Global styles and theme tokens
│   ├── robots.txt/              # Dynamic robots.txt generation
│   └── sitemap.xml/             # Dynamic sitemap generation
├── components/                   # React components
│   ├── providers/               # Context providers
│   │   ├── TenantProvider.tsx   # Tenant configuration context
│   │   └── ThemeProvider.tsx    # Dynamic theming context
│   └── ui/                      # UI components
│       ├── HeroSection.tsx      # Hero section component
│       ├── ActionButtons.tsx    # Call-to-action buttons
│       └── ThemeDemo.tsx        # Theme demonstration (dev only)
├── config/                      # Configuration files
│   ├── tenants.json            # Tenant registry
│   └── tenants/                # Individual tenant configurations
│       ├── default.json        # Default/fallback configuration
│       ├── abc-rentals.json    # ABC Car Rentals configuration
│       ├── xyz-cars.json       # XYZ Cars configuration
│       └── test-rental.json    # Test tenant configuration
├── lib/                        # Utility libraries
│   ├── types/                  # TypeScript type definitions
│   ├── tenant.ts              # Tenant configuration utilities
│   ├── theme-utils.ts         # Theme generation and validation
│   ├── seo-utils.ts           # SEO metadata generation
│   └── tenant-utils.ts        # Tenant-related utilities
├── scripts/                   # Build and utility scripts
│   └── test-tenant-configs.js # Configuration validation script
└── middleware.ts              # Next.js middleware for tenant detection
```

### Core Components

#### 1. **Tenant Detection (middleware.ts)**

- Extracts tenant ID from subdomain or query parameter
- Sets `x-tenant-id` header for server components
- Handles fallback to default tenant

#### 2. **Configuration System (lib/tenant.ts)**

- Loads tenant configurations from JSON files
- Validates configuration structure
- Provides fallback mechanisms
- Caches configurations for performance

#### 3. **Dynamic Theming (lib/theme-utils.ts)**

- Generates CSS custom properties from tenant themes
- Validates color formats and provides fallbacks
- Supports server-side rendering
- Creates derived colors (hover states, opacity variants)

#### 4. **SEO System (lib/seo-utils.ts)**

- Generates comprehensive metadata per tenant
- Creates Open Graph and Twitter Card tags
- Produces structured data (JSON-LD)
- Handles canonical URLs and robots directives

---

## ⚙️ Configuration

### Tenant Configuration Structure

Each tenant is configured through JSON files in the `config/tenants/` directory:

```json
{
  "id": "tenant-id",
  "name": "Tenant Display Name",
  "theme": {
    "primary": "#dc2626",
    "secondary": "#991b1b",
    "background": "#ffffff",
    "text": "#1f2937"
  },
  "content": {
    "hero": {
      "headline": "Your Compelling Headline",
      "description": "Engaging description of your service"
    },
    "about": {
      "title": "About Section Title",
      "content": "Detailed about content..."
    },
    "contact": {
      "phone": "+1-555-0123",
      "email": "contact@tenant.com",
      "address": "123 Business St, City, State 12345"
    }
  },
  "metadata": {
    "title": "Page Title - Tenant Name",
    "description": "SEO description for search engines",
    "seo": {
      "keywords": ["keyword1", "keyword2", "keyword3"],
      "favicon": "/favicons/tenant-favicon.ico",
      "openGraph": {
        "image": "/images/tenant-og-image.jpg",
        "type": "website",
        "locale": "en_US"
      },
      "twitter": {
        "card": "summary_large_image",
        "site": "@tenanthandle",
        "creator": "@tenanthandle"
      },
      "canonicalBase": "https://tenant-domain.com",
      "robots": "index, follow"
    }
  }
}
```

### Adding a New Tenant

1. **Create tenant configuration file**

   ```bash
   # Create config/tenants/new-tenant.json
   cp config/tenants/default.json config/tenants/new-tenant.json
   ```

2. **Update the configuration**
   - Change `id` to match filename (without .json)
   - Update `name`, `theme`, `content`, and `metadata`
   - Customize SEO settings

3. **Register in tenant registry**

   ```json
   // config/tenants.json
   {
     "tenants": {
       "new-tenant": {
         "id": "new-tenant",
         "name": "New Tenant Name",
         "status": "active",
         "configFile": "new-tenant.json"
       }
     }
   }
   ```

4. **Validate configuration**

   ```bash
   npm run test:config
   ```

5. **Test the new tenant**
   - Access: http://new-tenant.localhost:3000

### Theme Configuration

#### Color Properties

- `primary`: Main brand color (buttons, links, accents)
- `secondary`: Secondary brand color (supporting elements)
- `background`: Page background color
- `text`: Main text color

#### Color Format Support

- Hex: `#ff0000`, `#f00`
- RGB: `rgb(255, 0, 0)`
- RGBA: `rgba(255, 0, 0, 0.8)`
- HSL: `hsl(0, 100%, 50%)`
- HSLA: `hsla(0, 100%, 50%, 0.8)`

#### Auto-Generated Colors

The system automatically generates additional colors:

- `primary-hover`: Darker version of primary color
- `secondary-hover`: Darker version of secondary color
- `muted`: Semi-transparent text color
- `border`: Light border color
- `surface`: Semi-transparent background color

---

## 💻 Development

### Development Workflow

1. **Start development server**

   ```bash
   npm run dev
   ```

2. **Make changes to code or configurations**

3. **Validate changes**

   ```bash
   npm run validate  # Type check, lint, format
   npm run test:config  # Validate tenant configs
   ```

4. **Test across tenants**
   - http://abc-rentals.localhost:3000
   - http://xyz-cars.localhost:3000
   - http://test-rental.localhost:3000

### Environment Variables

Create a `.env.local` file for local development:

```bash
# Force specific tenant (for testing)
TENANT_OVERRIDE=abc-rentals

# Enable debug logging
DEBUG=tenant:*

# Node environment
NODE_ENV=development
```

### Adding New Components

1. **Create component file**

   ```typescript
   // components/ui/NewComponent.tsx
   interface NewComponentProps {
     title: string
     description?: string
   }

   export function NewComponent({ title, description }: NewComponentProps) {
     return (
       <div className="p-6 bg-surface rounded-lg border border-border">
         <h3 className="text-xl font-semibold text-text mb-2 font-heading">
           {title}
         </h3>
         {description && (
           <p className="text-muted font-body">{description}</p>
         )}
       </div>
     )
   }
   ```

2. **Use semantic color classes**
   - `bg-primary`, `bg-secondary`, `bg-background`, `bg-surface`
   - `text-text`, `text-muted`, `text-primary`, `text-secondary`
   - `border-border`, `border-primary`
   - `font-body`, `font-heading`

3. **Import and use in pages**

   ```typescript
   import { NewComponent } from '@/components/ui/NewComponent'

   export default function Page() {
     return (
       <main>
         <NewComponent
           title="Component Title"
           description="Component description"
         />
       </main>
     )
   }
   ```

### Styling Guidelines

#### Use Semantic Classes

```typescript
// ✅ Good - semantic color classes
<button className="bg-primary text-background hover:bg-primary-hover">
  Click me
</button>

// ❌ Avoid - hardcoded colors
<button className="bg-blue-500 text-white hover:bg-blue-600">
  Click me
</button>
```

#### Responsive Design

```typescript
// ✅ Mobile-first responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

#### Typography

```typescript
// ✅ Use semantic font classes
<h1 className="text-4xl font-bold text-text font-heading">Title</h1>
<p className="text-base text-muted font-body">Body text</p>
```

---

## 🚀 Deployment

### Production Build

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Test production build locally**

   ```bash
   npm run start
   ```

3. **Validate everything works**
   ```bash
   npm run validate
   npm run test:config
   ```

### Environment Setup

#### Production Environment Variables

```bash
# Production domain
NEXT_PUBLIC_BASE_URL=https://yourdomain.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=GA_MEASUREMENT_ID

# Error reporting (optional)
SENTRY_DSN=your_sentry_dsn
```

### Vercel Deployment

1. **Connect repository to Vercel**
2. **Configure build settings**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

3. **Set environment variables in Vercel dashboard**

4. **Configure custom domains**
   - Main domain: `yourdomain.com`
   - Tenant subdomains: `*.yourdomain.com`

### DNS Configuration

For subdomain-based tenants, configure DNS:

```
# DNS Records
A     yourdomain.com          → Vercel IP
CNAME *.yourdomain.com        → yourdomain.com
CNAME abc-rentals.yourdomain.com → yourdomain.com
CNAME xyz-cars.yourdomain.com    → yourdomain.com
```

### SSL Certificates

Ensure SSL certificates cover:

- Main domain: `yourdomain.com`
- Wildcard subdomain: `*.yourdomain.com`

---

## 🔧 Troubleshooting

### Common Issues

#### 1. **CSS Styles Not Loading**

**Symptoms**: Page appears unstyled or with basic styling

**Solutions**:

```bash
# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build

# Check Tailwind configuration
# Ensure globals.css has both @theme and :root blocks
```

#### 2. **Tenant Not Loading**

**Symptoms**: Always shows default tenant

**Solutions**:

```bash
# Check hostname spelling
# Verify tenant exists in config/tenants.json
# Validate configuration
npm run test:config

# Check middleware logs
DEBUG=tenant:* npm run dev
```

#### 3. **SEO Metadata Not Showing**

**Symptoms**: Generic meta tags instead of tenant-specific

**Solutions**:

```bash
# Check tenant configuration has metadata.seo section
# Verify canonical base URL is set
# Test with social media debuggers:
# - Facebook: https://developers.facebook.com/tools/debug/
# - Twitter: https://cards-dev.twitter.com/validator
```

#### 4. **Build Failures**

**Symptoms**: TypeScript or build errors

**Solutions**:

```bash
# Check TypeScript errors
npm run type-check

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Run full validation
npm run validate
```

### Debug Mode

Enable debug logging:

```bash
# Enable all debug logs
DEBUG=* npm run dev

# Enable tenant-specific logs
DEBUG=tenant:* npm run dev

# Enable theme-specific logs
DEBUG=theme:* npm run dev
```

### Performance Issues

#### Slow Page Loads

1. Check if tenant configurations are being cached
2. Verify image optimization is working
3. Monitor server-side rendering performance

#### Memory Issues

1. Check for memory leaks in theme providers
2. Verify proper cleanup in useEffect hooks
3. Monitor build memory usage

---

## 📚 API Reference

### Tenant Configuration API

#### `getTenantConfig(tenantId: string | null): Promise<TenantConfig>`

Loads tenant configuration with fallback to default.

```typescript
import { getTenantConfig } from '@/lib/tenant'

// In server component
const config = await getTenantConfig('abc-rentals')

// In API route
export async function GET(request: Request) {
  const tenantId = request.headers.get('x-tenant-id')
  const config = await getTenantConfig(tenantId)
  return Response.json(config)
}
```

#### `validateTenantConfig(config: any): ValidationResult`

Validates tenant configuration structure.

```typescript
import { validateTenantConfig } from '@/lib/tenant'

const validation = validateTenantConfig(config)
if (!validation.isValid) {
  console.error('Validation errors:', validation.errors)
}
```

### Theme API

#### `generateThemeCSS(theme: TenantTheme): string`

Generates CSS string for theme variables.

```typescript
import { generateThemeCSS } from '@/lib/theme-utils'

const cssString = generateThemeCSS({
  primary: '#dc2626',
  secondary: '#991b1b',
  background: '#ffffff',
  text: '#1f2937',
})
```

#### `validateTheme(theme: Partial<TenantTheme>): ValidationResult`

Validates theme colors and returns validated theme.

```typescript
import { validateTheme } from '@/lib/theme-utils'

const { isValid, errors, validatedTheme } = validateTheme(theme)
```

### SEO API

#### `generateTenantMetadata(config: TenantConfig, pathname: string): Metadata`

Generates Next.js metadata for a tenant.

```typescript
import { generateTenantMetadata } from '@/lib/utils/seo-utils'

// In layout.tsx or page.tsx
export async function generateMetadata(): Promise<Metadata> {
  const config = await getTenantConfig(tenantId)
  return generateTenantMetadata(config, '/about')
}
```

#### `generateLocalBusinessStructuredData(config: TenantConfig): string`

Generates JSON-LD structured data for local business.

```typescript
import { generateLocalBusinessStructuredData } from '@/lib/utils/seo-utils'

const structuredData = generateLocalBusinessStructuredData(config)
// Use in <script type="application/ld+json">
```

### React Hooks

#### `useTenant(): TenantContext`

Access tenant configuration in client components.

```typescript
import { useTenant } from '@/components/providers/TenantProvider'

function MyComponent() {
  const { config, isLoading, error } = useTenant()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return <h1>{config.name}</h1>
}
```

#### `useTenantTheme(): TenantTheme`

Access tenant theme in client components.

```typescript
import { useTenantTheme } from '@/components/providers/TenantProvider'

function ThemedComponent() {
  const theme = useTenantTheme()

  return (
    <div style={{ backgroundColor: theme.primary }}>
      Themed content
    </div>
  )
}
```

---

## 📚 Additional Documentation

For detailed documentation on specific topics, see the organized documentation in the [`docs/`](./docs/) folder:

### 🏗️ Architecture & Development

- **[Project Structure](./docs/project-structure.md)** - 📋 Comprehensive project structure documentation
- **[Development Guide](./docs/development-setup.md)** - Complete development setup and workflow
- **[Testing Guide](./docs/testing-summary.md)** - Testing strategies and best practices
- **[Development Testing](./docs/development-testing.md)** - Testing implementation details

### 🎨 UI & Styling

- **[CSS Fixes Summary](./docs/ui-css-fixes.md)** - CSS improvements and fixes
- **[SEO Implementation](./docs/ui-seo-implementation.md)** - SEO implementation details

### 🔧 Service Layer

- **[Service Layer Overview](./docs/services-overview.md)** - Service architecture and patterns
- **[Auth Service](./docs/services-auth.md)** - Authentication service documentation
- **[Base Service](./docs/services-base.md)** - Base service layer documentation
- **[Error Handling](./docs/services-error-handling.md)** - Error handling patterns and implementation

### 📖 Quick Start

1. **[Documentation Index](./docs/README.md)** - Overview of all documentation
2. **[Project Structure](./docs/project-structure.md)** - Understand the project architecture
3. **[Development Guide](./docs/development-setup.md)** - Start here for development
4. **[Service Architecture](./docs/services-overview.md)** - Understand the service layer

---

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Clone your fork**

   ```bash
   git clone https://github.com/yourusername/multi-tenant-storefront.git
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Create feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Code Standards

#### TypeScript

- Use strict TypeScript configuration
- Define interfaces for all props and data structures
- Avoid `any` type - use proper typing

#### React

- Use functional components with hooks
- Implement proper error boundaries
- Follow React best practices for performance

#### Styling

- Use semantic color classes (`bg-primary` vs `bg-blue-500`)
- Follow mobile-first responsive design
- Maintain consistent spacing and typography

#### Testing

- Validate all tenant configurations
- Test across multiple tenants
- Verify SEO metadata generation

### Pull Request Process

1. **Run quality checks**

   ```bash
   npm run validate
   npm run test:config
   ```

2. **Update documentation** if needed

3. **Create pull request** with:
   - Clear description of changes
   - Screenshots for UI changes
   - Test results

4. **Address review feedback**

### Reporting Issues

When reporting issues, include:

- Steps to reproduce
- Expected vs actual behavior
- Browser and Node.js versions
- Tenant configuration (if relevant)
- Console errors or logs

---

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

---

## 🆘 Support

For support and questions:

1. **Check this documentation** first
2. **Search existing issues** in the repository
3. **Create a new issue** with detailed information
4. **Join community discussions** (if available)

---

_Last updated: [Current Date]_
_Version: 1.0.0_
