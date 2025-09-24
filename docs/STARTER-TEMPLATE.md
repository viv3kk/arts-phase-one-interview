# Multi-Tenant Starter Template

## 🎯 Overview

This is a clean, production-ready multi-tenant starter template built with Next.js 15, designed to be the foundation for any multi-tenant SaaS application. The template provides all the essential infrastructure while remaining flexible for customization.

## 🏗️ What's Included

### Core Infrastructure

- **Multi-tenant Architecture**: Subdomain-based tenant detection and routing
- **Dynamic Theming**: CSS custom properties with server-side theme injection
- **Authentication System**: OTP-based authentication with modal system
- **SEO Optimization**: Dynamic metadata and structured data per tenant
- **Performance**: ISR, SSG, and SSR rendering strategies
- **Type Safety**: Full TypeScript implementation

### UI Components

- **shadcn/ui Integration**: Complete component library
- **Mobile-First Design**: Responsive components with touch-friendly interfaces
- **Theme-Aware Components**: All components adapt to tenant themes
- **Accessibility**: Built-in ARIA support and keyboard navigation

### Development Tools

- **Hot Reloading**: Fast development with Next.js 15
- **TypeScript**: Strict type checking and IntelliSense
- **ESLint**: Code quality and consistency
- **Tailwind CSS**: Utility-first styling with v4 features

## 🚀 Getting Started

### 1. Clone and Install

```bash
git clone <repository-url>
cd multi-tenant-template
npm install
```

### 2. Start Development

```bash
npm run dev
```

### 3. Test Multi-Tenancy

```bash
# Default tenant (Ocean theme)
open http://localhost:3000

# Custom tenants
open http://abc-rental.localhost:3000  # Fire theme
open http://xyz-rental.localhost:3000  # Forest theme
```

## 🎨 Customization Guide

### Adding New Tenants

1. **Create Tenant Config**:

```bash
# Create new tenant configuration
cp config/tenants/default.json config/tenants/your-tenant.json
```

2. **Update Tenant Registry**:

```json
// config/tenants.json
{
  "your-tenant": {
    "name": "Your Tenant",
    "subdomain": "your-tenant",
    "theme": "ocean"
  }
}
```

3. **Customize Theme**:

```json
// config/tenants/your-tenant.json
{
  "theme": {
    "primary": "#your-color",
    "secondary": "#your-secondary",
    "fonts": {
      "heading": "Your Font",
      "body": "Your Body Font"
    }
  }
}
```

### Adding New Pages

1. **Create Page Structure**:

```bash
# Create new page
mkdir app/your-feature
touch app/your-feature/page.tsx
```

2. **Add Route Groups** (optional):

```bash
# For authenticated pages
mkdir app/\(authenticated\)/your-feature
touch app/\(authenticated\)/your-feature/page.tsx
```

### Adding New Components

1. **Feature Components**:

```bash
# Create feature component
mkdir components/features/your-feature
touch components/features/your-feature/YourComponent.tsx
```

2. **Export from Index**:

```typescript
// components/features/your-feature/index.ts
export { YourComponent } from './YourComponent'
```

### Adding New Services

1. **Create Service**:

```bash
# Create service
mkdir lib/services/your-service
touch lib/services/your-service/your-service.ts
```

2. **Add Hooks**:

```typescript
// lib/services/hooks/your-service-hooks.ts
export function useYourService() {
  // Your service logic
}
```

## 🎨 Theme System

### Available Themes

- **Ocean**: `#2563eb` - Professional, trustworthy (default)
- **Fire**: `#dc2626` - Bold, energetic
- **Forest**: `#059669` - Natural, sustainable

### Custom Theme Creation

```json
{
  "theme": {
    "primary": "#your-primary-color",
    "secondary": "#your-secondary-color",
    "accent": "#your-accent-color",
    "background": "#your-background",
    "foreground": "#your-foreground",
    "muted": "#your-muted",
    "border": "#your-border"
  }
}
```

### Using Themes in Components

```tsx
// Components automatically adapt to tenant themes
<Button>Primary Action</Button>               // Uses theme primary color
<Card>Themed content</Card>                   // Adapts borders and backgrounds
<Badge variant="outline">Status</Badge>       // Themed badges
```

## 🔐 Authentication System

### OTP Authentication Flow

1. **Mobile Number Input**: User enters phone number
2. **OTP Verification**: User receives and enters OTP
3. **Profile Setup**: Basic user profile creation
4. **Authentication Complete**: User is logged in

### Adding Custom Auth Steps

```typescript
// Add new onboarding step
export enum ONBOARDING_STEP {
  MOBILE = 'mobile',
  OTP = 'otp',
  PROFILE = 'profile',
  YOUR_STEP = 'your_step', // Add your step
}
```

## 📱 Mobile-First Design

### Key Principles

- **Touch-Friendly**: Minimum 44px touch targets
- **Responsive**: Mobile-first breakpoints
- **Performance**: Optimized for mobile loading
- **Accessibility**: Screen reader and keyboard support

### Component Patterns

```tsx
// Mobile-first responsive design
<div className='p-4 md:p-6 lg:p-8'>
  <h1 className='text-xl md:text-2xl lg:text-3xl'>Title</h1>
  <Button className='h-11 md:h-10 w-full md:w-auto'>
    Mobile-friendly button
  </Button>
</div>
```

## 🚀 Deployment

### Vercel Deployment

```bash
# Deploy to Vercel
npx vercel

# Set environment variables
vercel env add NEXT_PUBLIC_APP_URL
vercel env add DATABASE_URL
```

### Custom Domain Setup

```bash
# Add custom domains for tenants
vercel domains add your-tenant.com
vercel domains add another-tenant.com
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run specific test
npm test -- --testNamePattern="Auth"

# Run with coverage
npm test -- --coverage
```

### Test Multi-Tenancy

```bash
# Test different tenants
curl http://localhost:3000
curl http://abc-rental.localhost:3000
curl http://xyz-rental.localhost:3000
```

## 📚 Documentation

- **Architecture**: `docs/ARCHITECTURE-OVERVIEW.md`
- **Theme System**: `docs/THEME-SYSTEM.md`
- **UI Components**: `docs/UI-COMPONENTS.md`
- **Rendering Strategies**: `docs/RENDERING-STRATEGIES.md`
- **Quick Reference**: `docs/QUICK-REFERENCE.md`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the `docs/` folder
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

---

**Ready to build your multi-tenant SaaS? Start customizing this template today!** 🚀
