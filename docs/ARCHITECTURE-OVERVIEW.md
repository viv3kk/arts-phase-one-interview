# Architecture Overview

## System Architecture

This multi-tenant storefront is built with **Next.js 15**, **Tailwind CSS v4**, and **shadcn/ui**, featuring a sophisticated theme system and optimized rendering strategies.

```mermaid
graph TB
    Client[Client Browser]
    CDN[CDN/Edge Cache]
    Middleware[Next.js Middleware]
    App[Next.js App Router]

    Client --> CDN
    CDN --> Middleware
    Middleware --> App

    subgraph "Tenant Detection"
        Middleware --> TenantResolver[Tenant Resolver]
        TenantResolver --> TenantConfig[Tenant Config]
    end

    subgraph "Theme System"
        TenantConfig --> ThemeEngine[Theme Engine]
        ThemeEngine --> CSS[CSS Generation]
        CSS --> Layout[Layout Injection]
    end

    subgraph "Rendering"
        App --> SSG[Static Pages]
        App --> ISR[ISR Pages]
        App --> SSR[Dynamic Pages]
    end

    subgraph "UI Layer"
        Layout --> ShadcnUI[shadcn/ui Components]
        ShadcnUI --> TailwindCSS[Tailwind CSS v4]
    end
```

## Core Components

### 1. Multi-Tenancy System

#### Tenant Detection Flow

```mermaid
sequenceDiagram
    participant User
    participant Middleware
    participant TenantResolver
    participant App

    User->>Middleware: Request (subdomain/query)
    Middleware->>TenantResolver: Extract tenant identifier
    TenantResolver->>Middleware: Return tenant ID
    Middleware->>App: Forward with x-tenant-id header
    App->>App: Load tenant configuration
    App->>User: Render themed response
```

#### File Structure

```
config/
├── tenants.json                 # Tenant registry
└── tenants/
    ├── abc-rental.json          # Fire theme tenant
    ├── xyz-rental.json          # Forest theme tenant
    └── default.json             # Ocean theme default

lib/
├── tenant.ts                    # Tenant utilities
├── tenant-utils.ts             # Helper functions
└── types/
    └── tenant.ts               # TypeScript interfaces
```

### 2. Theme System Architecture

#### Theme Flow

```mermaid
graph LR
    TenantConfig[Tenant Config] --> ThemeID[Theme ID]
    ThemeID --> ThemeResolver[Theme Resolver]
    ThemeResolver --> CSSGenerator[CSS Generator]
    CSSGenerator --> Variables[CSS Variables]
    Variables --> Components[UI Components]

    subgraph "CSS Variables"
        Variables --> Tailwind[--color-primary]
        Variables --> Shadcn[--primary]
    end
```

#### Implementation Structure

```
lib/themes/
├── index.ts                     # Main exports
├── themes.ts                    # Theme definitions
└── generator.ts                 # CSS generation

components/providers/
├── ThemeProvider.tsx            # Client-side context
└── TenantProvider.tsx          # Tenant context
```

### 3. Rendering Strategy Architecture

#### Page-Level Rendering Decisions

```mermaid
graph TD
    Request[Incoming Request] --> UserData{Requires User Data?}
    UserData -->|Yes| SSR[Server-Side Rendering]
    UserData -->|No| UpdateFreq{Update Frequency?}

    UpdateFreq -->|Never| SSG[Static Site Generation]
    UpdateFreq -->|Periodic| ISR[Incremental Static Regeneration]
    UpdateFreq -->|Real-time| SSR

    SSG --> Cache1[CDN Cache]
    ISR --> Cache2[ISR Cache + Revalidation]
    SSR --> Cache3[No Static Cache]
```

#### Current Implementation

| Route Pattern     | Strategy  | Reason                               |
| ----------------- | --------- | ------------------------------------ |
| `/`               | ISR (1hr) | Tenant content, updates occasionally |
| `/about`          | SSG       | Static content, rarely changes       |
| `/dashboard`      | SSR       | User-specific, real-time             |
| `/api/revalidate` | SSR       | Dynamic API endpoint                 |

### 4. Component Architecture

#### UI Component Hierarchy

```mermaid
graph TB
    App[App Layout] --> Providers[Providers]
    Providers --> TenantProvider
    Providers --> ThemeProvider

    ThemeProvider --> Pages[Page Components]
    Pages --> ShadcnUI[shadcn/ui Components]
    Pages --> Custom[Custom Components]

    subgraph "shadcn/ui"
        ShadcnUI --> Button
        ShadcnUI --> Card
        ShadcnUI --> Input
        ShadcnUI --> Badge
    end

    subgraph "Custom"
        Custom --> ActionButtons
        Custom --> HeroSection
        Custom --> ThemeDemo
    end
```

#### Component Data Flow

```mermaid
sequenceDiagram
    participant Server
    participant Layout
    participant ThemeProvider
    participant Component

    Server->>Layout: Inject theme CSS
    Layout->>ThemeProvider: Provide theme context
    ThemeProvider->>Component: Theme values available
    Component->>Component: Render with theme
```

## Technology Stack

### Core Technologies

| Technology       | Version | Purpose                    |
| ---------------- | ------- | -------------------------- |
| **Next.js**      | 15.4.6  | Full-stack React framework |
| **React**        | 18+     | UI library                 |
| **TypeScript**   | Latest  | Type safety                |
| **Tailwind CSS** | v4      | Utility-first CSS          |
| **shadcn/ui**    | Latest  | Component library          |

### Development Tools

| Tool         | Purpose         |
| ------------ | --------------- |
| **ESLint**   | Code linting    |
| **Prettier** | Code formatting |
| **Husky**    | Git hooks       |

## Performance Architecture

### Caching Strategy

```mermaid
graph LR
    User[User Request] --> CDN[CDN Cache]
    CDN --> Edge[Edge Functions]
    Edge --> ISR[ISR Cache]
    ISR --> Server[Server Rendering]

    subgraph "Cache Layers"
        CDN --> L1[Static Assets]
        Edge --> L2[Edge Computation]
        ISR --> L3[Pre-rendered Pages]
        Server --> L4[Dynamic Rendering]
    end
```

### Build Optimization

```mermaid
graph TB
    Build[npm run build] --> Analysis[Bundle Analysis]
    Analysis --> StaticGen[Static Generation]
    StaticGen --> ISRPrep[ISR Preparation]
    ISRPrep --> Output[Optimized Output]

    subgraph "Generated Assets"
        Output --> HTML[Static HTML]
        Output --> CSS[Optimized CSS]
        Output --> JS[Tree-shaken JS]
    end
```

## Security Architecture

### Tenant Isolation

```mermaid
graph TB
    Request[Request] --> Middleware[Security Middleware]
    Middleware --> Validation[Tenant Validation]
    Validation --> Isolation[Data Isolation]

    subgraph "Security Layers"
        Validation --> ConfigValidation[Config Validation]
        Validation --> ThemeValidation[Theme Validation]
        Isolation --> DataBoundaries[Data Boundaries]
        Isolation --> AssetIsolation[Asset Isolation]
    end
```

### Configuration Security

- **Tenant configs** are validated server-side
- **Theme properties** are sanitized and validated
- **API endpoints** include secret-based authentication
- **Headers** are properly sanitized in middleware

## Deployment Architecture

### Production Flow

```mermaid
graph LR
    Git[Git Push] --> CI[CI/CD Pipeline]
    CI --> Build[Build Process]
    Build --> Deploy[Deployment]
    Deploy --> CDN[CDN Distribution]

    subgraph "Build Steps"
        Build --> StaticGen[Static Generation]
        Build --> BundleOpt[Bundle Optimization]
        Build --> AssetMin[Asset Minification]
    end

    subgraph "Deployment"
        Deploy --> ServerDeploy[Server Deployment]
        Deploy --> StaticDeploy[Static Asset Deployment]
    end
```

### Environment Configuration

```bash
# Production
NEXT_PUBLIC_APP_URL=https://your-domain.com
REVALIDATION_SECRET=your-secret-key

# Development
NEXT_PUBLIC_APP_URL=http://localhost:3001
REVALIDATION_SECRET=dev-secret
```

## Data Flow

### Request Lifecycle

```mermaid
sequenceDiagram
    participant User
    participant CDN
    participant Middleware
    participant App
    participant Theme
    participant Component

    User->>CDN: HTTP Request
    CDN->>Middleware: Forward request
    Middleware->>Middleware: Extract tenant ID
    Middleware->>App: Request + headers
    App->>Theme: Generate theme CSS
    App->>Component: Render with theme
    Component->>User: Themed HTML response
```

### Theme Application Flow

```mermaid
graph TB
    TenantID[Tenant ID] --> ConfigLoad[Load Config]
    ConfigLoad --> ThemeID[Extract Theme ID]
    ThemeID --> ThemeLoad[Load Theme Definition]
    ThemeLoad --> CSSGen[Generate CSS Variables]
    CSSGen --> Inject[Inject into HTML]
    Inject --> Render[Render Components]
```

## Scalability Considerations

### Horizontal Scaling

- **Stateless architecture** enables multiple server instances
- **CDN caching** reduces server load
- **ISR** provides performance with freshness
- **Component-level caching** optimizes rendering

### Performance Optimizations

1. **Theme CSS** is generated server-side and cached
2. **Static assets** are optimized and CDN-distributed
3. **JavaScript bundles** are tree-shaken and code-split
4. **Images** are optimized with Next.js Image component

### Monitoring Points

```mermaid
graph LR
    Metrics[Monitoring] --> Performance[Performance Metrics]
    Metrics --> Errors[Error Tracking]
    Metrics --> Cache[Cache Hit Rates]

    Performance --> TTFB[Time to First Byte]
    Performance --> LCP[Largest Contentful Paint]
    Performance --> CLS[Cumulative Layout Shift]

    Cache --> ISRHits[ISR Cache Hits]
    Cache --> CDNHits[CDN Cache Hits]
```

## Development Workflow

### Local Development

```bash
# 1. Start development server
npm run dev

# 2. Access tenants
http://localhost:3001                    # Default (Ocean)
http://abc-rental.localhost:3001         # Fire theme
http://xyz-rental.localhost:3001         # Forest theme

# 3. Test theme switching
curl "http://localhost:3001/?tenant=abc-rental"
```

### Testing Strategy

```mermaid
graph TB
    Tests[Testing] --> Unit[Unit Tests]
    Tests --> Integration[Integration Tests]
    Tests --> E2E[E2E Tests]

    Unit --> Components[Component Tests]
    Unit --> Utils[Utility Tests]

    Integration --> ThemeSystem[Theme System Tests]
    Integration --> Rendering[Rendering Tests]

    E2E --> UserFlows[User Flow Tests]
    E2E --> CrossTenant[Cross-tenant Tests]
```

## File Structure Overview

```
storefront/
├── app/
│   ├── layout.tsx                # Root layout with theme injection
│   ├── page.tsx                 # Main tenant page (ISR)
│   ├── globals.css              # Global styles + shadcn/ui
│   └── api/
│       └── revalidate/          # ISR revalidation endpoint
├── components/
│   ├── providers/               # Context providers
│   └── ui/                      # UI components
├── config/
│   ├── tenants.json            # Tenant registry
│   └── tenants/                # Individual tenant configs
├── lib/
│   ├── themes/                 # Theme system
│   ├── types/                  # TypeScript definitions
│   └── utils/                  # Utility functions
├── middleware.ts               # Tenant detection
└── next.config.js             # Next.js configuration
```

## Migration Path

### From Legacy Systems

1. **Assessment**: Evaluate current architecture
2. **Planning**: Design migration strategy
3. **Implementation**:
   - Start with theme system
   - Add shadcn/ui components
   - Implement rendering strategies
4. **Testing**: Comprehensive testing across tenants
5. **Deployment**: Gradual rollout with monitoring

### Upgrade Path

1. **Next.js updates**: Follow Next.js upgrade guides
2. **Tailwind CSS**: Migrate to v4 features gradually
3. **shadcn/ui**: Keep components updated
4. **Theme system**: Add new themes as needed

This architecture provides a solid foundation for a scalable, performant, and maintainable multi-tenant storefront application.
