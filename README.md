# Multi-Tenant Starter Template

A modern, high-performance multi-tenant starter template built with **Next.js 15**, **shadcn/ui**, and **Tailwind CSS v4**. Features sophisticated theming, optimized rendering strategies, and enterprise-grade architecture ready for customization.

## ✨ Features

- **🏢 Multi-Tenancy**: Subdomain-based tenant routing with isolated configurations
- **🎨 Dynamic Theming**: Server-side theme injection with shadcn/ui integration
- **⚡ Performance**: ISR, SSG, and SSR strategies for optimal loading
- **🧩 Component Library**: Beautiful, accessible UI with shadcn/ui components
- **📱 Responsive**: Mobile-first design with Tailwind CSS v4
- **🔍 SEO Optimized**: Dynamic metadata and structured data per tenant
- **🔧 Type Safe**: Full TypeScript implementation with strict types
- **🔐 Authentication**: OTP-based authentication system
- **🚀 Ready to Customize**: Clean starter template for rapid development

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit different tenants
open http://localhost:3000                    # Ocean theme (default)
open http://abc-rental.localhost:3000         # Fire theme (red)
open http://xyz-rental.localhost:3000         # Forest theme (green)
```

## 🎨 Theme System

### Available Themes

- **🌊 Ocean**: `#2563eb` - Professional, trustworthy (default)
- **🔥 Fire**: `#dc2626` - Bold, energetic (automotive/sports)
- **🌲 Forest**: `#059669` - Natural, sustainable (eco-friendly)

### Usage Example

```tsx
// Components automatically adapt to tenant themes
<Button>Primary Action</Button>               // Uses theme primary color
<Card>Themed content</Card>                   // Adapts borders and backgrounds
<Badge variant="outline">Status</Badge>       // Themed badges
```

## 🏗️ Architecture

### Rendering Strategies

| Content Type    | Strategy | Cache Duration | Use Case                         |
| --------------- | -------- | -------------- | -------------------------------- |
| Landing pages   | **ISR**  | 1 hour         | Tenant content, periodic updates |
| Static pages    | **SSG**  | Build time     | About, terms, privacy            |
| User dashboards | **SSR**  | Real-time      | Dynamic, user-specific           |

### Component Architecture

```
📦 shadcn/ui Components
├── 🎨 Automatic theme adaptation via CSS variables
├── ♿ Built-in accessibility features
├── 🎯 Semantic class integration
└── 📱 Responsive design patterns
```

## 📚 Documentation

### Core Guides

- **[📚 Documentation Index](./docs/README.md)** - **START HERE** - Complete documentation overview
- **[⚡ Quick Reference](./docs/QUICK-REFERENCE.md)** - Developer cheat sheet for daily use
- **[🎨 Theme System](./docs/THEME-SYSTEM.md)** - Complete theming implementation
- **[🧩 UI Components](./docs/UI-COMPONENTS.md)** - shadcn/ui component usage
- **[🏗️ Rendering Strategies](./docs/RENDERING-STRATEGIES.md)** - SSG/ISR/SSR guide
- **[🏛️ Architecture Overview](./docs/ARCHITECTURE-OVERVIEW.md)** - System design

### Additional Resources

- [Development & Testing](DEVELOPMENT-TESTING.md)
- [SEO Implementation](SEO-IMPLEMENTATION-SUMMARY.md)
- [Performance Optimization](CSS-FIX-SUMMARY.md)

## 🗂️ Project Structure

```
storefront/
├── app/
│   ├── layout.tsx              # Theme injection + providers
│   ├── page.tsx               # Main tenant page (ISR)
│   ├── globals.css            # Tailwind + shadcn/ui styles
│   └── api/revalidate/        # Cache invalidation
├── components/
│   ├── providers/             # Theme & tenant context
│   └── ui/                    # shadcn/ui components
├── config/
│   ├── tenants.json           # Tenant registry
│   └── tenants/               # Individual tenant configs
├── docs/                      # 📚 Complete documentation
│   ├── README.md              # Documentation index
│   ├── QUICK-REFERENCE.md     # Developer cheat sheet
│   ├── THEME-SYSTEM.md        # Theme system guide
│   ├── UI-COMPONENTS.md       # Component usage
│   ├── RENDERING-STRATEGIES.md # SSG/ISR/SSR guide
│   └── ARCHITECTURE-OVERVIEW.md # System architecture
├── lib/
│   ├── themes/                # Theme system core
│   ├── types/                 # TypeScript definitions
│   └── utils/                 # Helper functions
├── middleware.ts              # Tenant detection
└── next.config.js             # Optimized configuration
```

## 🛠️ Tech Stack

### Core Framework

- **[Next.js 15](https://nextjs.org)** - Full-stack React framework
- **[React 18](https://react.dev)** - UI library with concurrent features
- **[TypeScript](https://typescriptlang.org)** - Type-safe development

### Styling & UI

- **[Tailwind CSS v4](https://tailwindcss.com)** - Utility-first CSS framework
- **[shadcn/ui](https://ui.shadcn.com)** - High-quality component library
- **CSS Custom Properties** - Dynamic theming system

### Performance & Optimization

- **ISR** - Incremental Static Regeneration for optimal caching
- **SSG** - Static Site Generation for marketing pages
- **SSR** - Server-Side Rendering for dynamic content
- **Bundle Optimization** - Tree-shaking and code splitting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd storefront

# Install dependencies
npm install

# Start development server
npm run dev
```

### Development Workflow

```bash
# Start with theme system
npm run dev                                   # Start development

# Test different tenants
curl "http://abc-rental.localhost:3001"      # Fire theme
curl "http://xyz-rental.localhost:3001"      # Forest theme

# Build for production
npm run build
```

## 🎯 Usage Examples

### Creating Themed Components

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function ProductCard({ product }) {
  return (
    <Card className='h-full'>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-muted-foreground'>{product.description}</p>
        <Button className='w-full mt-4'>Book Now</Button>
      </CardContent>
    </Card>
  )
}
```

### Adding New Tenants

```json
// config/tenants/new-tenant.json
{
  "id": "new-tenant",
  "name": "New Tenant",
  "theme": "forest",
  "content": {
    "hero": {
      "headline": "Welcome to New Tenant",
      "description": "Your trusted service provider"
    }
  }
}
```

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js 15, shadcn/ui, and Tailwind CSS v4**
