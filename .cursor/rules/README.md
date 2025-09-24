# Cursor Rules for Multi-Tenant Storefront

This directory contains comprehensive development rules for the multi-tenant storefront project, designed to ensure consistent code quality, architecture patterns, and developer experience.

## 📋 **Rules Overview**

### **Core Rules**

- **`.cursorrules`** - Main development rules file (root level)
- **`project-brief.mdc`** - Project overview and architecture
- **`multi-tenant-architecture.mdc`** - Multi-tenant patterns and best practices
- **`zustand.mdc`** - State management with Zustand
- **`service-layer.mdc`** - Service layer architecture
- **`hooks-architecture.mdc`** - Hook design patterns and architecture
- **`nextjs.mdc`** - Next.js 15 App Router patterns
- **`react.mdc`** - React best practices
- **`shadcn-components.mdc`** - shadcn/ui component usage
- **`typescript.mdc`** - TypeScript best practices
- **`tailwind.mdc`** - Tailwind CSS patterns
- **`clean-code.mdc`** - Clean code principles
- **`code-quality.mdc`** - Code quality guidelines
- **`ui-mobile-first.mdc`** - **UI Mobile-First Design Rules (ALWAYS APPLIED)**

## 🎯 **Key Principles**

### **1. Multi-Tenant Architecture**

- Subdomain-based routing with dynamic tenant detection
- Theme system with CSS custom properties
- Tenant-specific configurations and SEO
- Proper data isolation and security

### **2. Modern Tech Stack**

- **Next.js 15** with App Router and Server Components
- **React 18+** with concurrent features
- **TypeScript** with strict configuration
- **Tailwind CSS v4** with semantic design tokens
- **shadcn/ui** for component library
- **Zustand** for client-side state management
- **React Query** for server state management

### **3. Performance & Developer Experience**

- Server Components First approach
- Consolidated loading states for simpler logic
- Service layer pattern for API calls
- Comprehensive error handling
- Type safety throughout the application

### **4. Mobile-First Design (CRITICAL)**

- **Mobile-first breakpoints**: Start with mobile styles, enhance for larger screens
- **Touch-friendly interactions**: Minimum 44px touch targets
- **Responsive typography**: Scale text appropriately across devices
- **Mobile-optimized layouts**: Card layouts for mobile, table layouts for desktop
- **Thumb-zone navigation**: Ensure navigation is accessible on mobile

## 🏗️ **Architecture Patterns**

### **Rendering Strategies**

| Content Type    | Strategy | Use Case         |
| --------------- | -------- | ---------------- |
| Marketing pages | SSG      | Static content   |
| Product catalog | ISR      | Periodic updates |
| User dashboard  | SSR      | User-specific    |
| Tenant landing  | ISR      | Monthly updates  |

### **State Management**

- **Zustand**: Slice-based architecture with SSR compatibility
- **React Query**: Server state management with caching
- **Consolidated Loading States**: Single loading state per domain

### **Service Layer**

- **Three-Layer Pattern**: Endpoints → Services → Hooks
- **Type Safety**: Full TypeScript support
- **Error Handling**: Custom error classes
- **Multi-Tenant**: Tenant-aware API clients

## 🎨 **Theme System**

### **Semantic Design Tokens**

```css
:root {
  --color-primary: #2563eb; /* Ocean theme */
  --color-secondary: #64748b;
  --color-background: #ffffff;
  --color-foreground: #0f172a;
}
```

### **Component Theming**

```tsx
// ✅ Automatic theme adaptation
<Button className="bg-primary text-primary-foreground">
  Themed Button
</Button>

// ❌ Avoid hardcoded colors
<button className="bg-blue-600 text-white">
  Hardcoded Button
</button>
```

## 🔧 **Development Workflow**

### **Multi-Tenant Testing**

```bash
# Test different tenants
http://localhost:3000                    # Default (Ocean)
http://abc-rental.localhost:3000         # Fire theme
http://xyz-rental.localhost:3000         # Forest theme
```

### **Common Commands**

```bash
npm run dev              # Start development
npm run build           # Production build
npm run lint            # ESLint checking
npm run type-check      # TypeScript validation
npm run test:config     # Validate tenant configs
```

## 📚 **Documentation Integration**

These rules are designed to work with the comprehensive documentation in the `docs/` directory:

- **Quick Reference**: `docs/QUICK-REFERENCE.md`
- **Architecture Overview**: `docs/ARCHITECTURE-OVERVIEW.md`
- **Theme System**: `docs/THEME-SYSTEM.md`
- **UI Components**: `docs/UI-COMPONENTS.md`
- **Rendering Strategies**: `docs/RENDERING-STRATEGIES.md`

## 🎯 **Best Practices Summary**

### **Do's**

- ✅ Use Server Components by default
- ✅ Implement semantic theming with CSS custom properties
- ✅ Use service layer pattern for API calls
- ✅ Implement consolidated loading states
- ✅ Use shadcn/ui components consistently
- ✅ Write comprehensive tests
- ✅ Follow TypeScript best practices

### **Don'ts**

- ❌ Don't use client components unnecessarily
- ❌ Avoid hardcoded colors in components
- ❌ Don't use direct fetch calls in components
- ❌ Avoid multiple loading states per domain
- ❌ Don't forget error handling
- ❌ Avoid any types in TypeScript

## 🔄 **Migration Support**

The rules include migration patterns for:

- From Pages Router to App Router
- From client-side to server-side data fetching
- From multiple loading states to consolidated states
- From direct fetch to service layer

## 🧪 **Testing Patterns**

Comprehensive testing patterns for:

- Server Components
- Client Components
- Service Layer
- State Management
- Multi-Tenant Configuration

## 📈 **Performance Optimization**

Guidelines for:

- Code splitting and lazy loading
- Image optimization
- Bundle optimization
- Caching strategies
- Core Web Vitals

These rules ensure consistent, high-quality development across the multi-tenant storefront application while maintaining excellent developer experience and user experience.
