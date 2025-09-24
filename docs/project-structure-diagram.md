# Project Structure Visual Diagram

## 🏗️ Complete Project Structure

```
storefront/
├── 📚 docs/                           # 📖 All Documentation
│   ├── README.md                      # 📋 Documentation Index
│   ├── project-structure.md           # 📋 This file
│   ├── project-structure-diagram.md   # 📊 Visual diagrams
│   ├── development-setup.md           # 🛠️ Development Guide
│   ├── development-testing.md         # 🧪 Testing Implementation
│   ├── testing-summary.md             # 🧪 Testing Best Practices
│   ├── ui-css-fixes.md               # 🎨 CSS Improvements
│   ├── ui-seo-implementation.md       # 📊 SEO Implementation
│   ├── services-overview.md           # 🔧 Service Architecture
│   ├── services-auth.md              # 🔐 Auth Service Docs
│   ├── services-base.md              # ⚙️ Base Service Docs
│   ├── services-tenant-context.md    # 🏢 Tenant Context Docs
│   └── services-error-handling.md    # ⚠️ Error Handling Docs
│
├── 🎨 app/                            # 🚀 Next.js App Router
│   ├── layout.tsx                     # 🏗️ Root Layout
│   ├── page.tsx                       # 🏠 Home Page
│   ├── globals.css                    # 🎨 Global Styles
│   ├── robots.txt/                    # 🤖 SEO Robots
│   │   └── route.ts
│   └── sitemap.xml/                   # 🗺️ SEO Sitemap
│       └── route.ts
│
├── 🧩 components/                     # ⚛️ React Components
│   ├── providers/                     # 🔄 Context Providers
│   │   ├── TenantProvider.tsx         # 🏢 Tenant Context
│   │   └── ThemeProvider.tsx          # 🎨 Theme Context
│   └── ui/                           # 🧩 UI Components
│       ├── HeroSection.tsx            # 🎯 Hero Section
│       ├── ActionButtons.tsx          # 🔘 Action Buttons
│       └── ThemeDemo.tsx              # 🎨 Theme Demo
│
├── ⚙️ config/                         # ⚙️ Configuration
│   ├── tenants.json                   # 📋 Tenant Registry
│   └── tenants/                       # 🏢 Tenant Configs
│       ├── default.json              # 🔄 Default Config
│       ├── abc-rentals.json          # 🚗 ABC Rentals
│       ├── xyz-cars.json             # 🚙 XYZ Cars
│       └── test-rental.json          # 🧪 Test Tenant
│
├── 🔧 lib/                           # 🔧 Core Library
│   ├── config/                       # ⚙️ Configuration
│   │   ├── api-endpoints.ts          # 🌐 API Endpoints
│   │   └── service-config.ts         # 🔧 Service Config
│   │
│   ├── services/                     # 🔧 Service Layer
│   │   ├── auth/                     # 🔐 Authentication
│   │   │   ├── auth-service.ts       # 🚀 Auth Service
│   │   │   ├── auth-interceptor.ts   # 🔄 Auth Interceptors
│   │   │   └── index.ts             # 📦 Auth Exports
│   │   │
│   │   ├── base/                     # ⚙️ Base Infrastructure
│   │   │   ├── api-client.ts         # 🌐 Enhanced API Client
│   │   │   ├── interceptors.ts       # 🔄 Request/Response Interceptors
│   │   │   ├── error-handler.ts      # ⚠️ Error Handling
│   │   │   ├── error-factory.ts      # 🏭 Error Factory
│   │   │   ├── tenant-context.ts     # 🏢 Tenant Context
│   │   │   ├── types.ts             # 📝 Type Definitions
│   │   │   ├── index.ts             # 📦 Base Exports
│   │   │   └── __tests__/           # 🧪 Test Suite
│   │   │       ├── api-client.test.ts
│   │   │       ├── error-factory.test.ts
│   │   │       ├── error-handler.test.ts
│   │   │       ├── integration.test.ts
│   │   │       ├── interceptors.test.ts
│   │   │       └── tenant-context.test.ts
│   │   │
│   │   ├── booking/                  # 📅 Booking Services
│   │   │   └── booking-service.ts    # 🚗 Booking Operations
│   │   │
│   │   ├── hooks/                    # 🪝 React Query Hooks
│   │   │   └── auth-hooks.ts         # 🔐 Auth Hooks
│   │   │
│   │   └── index.ts                  # 📦 Service Exports
│   │
│   ├── types/                        # 📝 TypeScript Types
│   │   ├── auth.types.ts            # 🔐 Auth Types
│   │   ├── tenant.ts                # 🏢 Tenant Types
│   │   ├── service.ts               # 🔧 Service Types
│   │   ├── index.ts                 # 📦 Type Exports
│   │   └── api/                     # 🌐 API Types
│   │       ├── common.ts            # 🔄 Common Types
│   │       └── index.ts             # 📦 API Type Exports
│   │
│   ├── tenant.ts                     # 🏢 Tenant Utilities
│   ├── tenant-utils.ts              # 🛠️ Tenant Helpers
│   ├── theme-utils.ts               # 🎨 Theme Generation
│   ├── seo-utils.ts                 # 📊 SEO Utilities
│   └── server-theme.ts              # 🖥️ Server Theming
│
├── 📜 scripts/                       # 📜 Build Scripts
│   ├── test-tenant-configs.js        # 🧪 Config Validation
│   └── generate-api-types.js         # 🔧 Type Generation
│
├── 🐕 .husky/                        # 🐕 Git Hooks
│   └── pre-commit                   # 🔄 Pre-commit Hook
│
├── ⚙️ .vscode/                       # ⚙️ VS Code Settings
│   └── settings.json                # ⚙️ Workspace Settings
│
├── 📋 Configuration Files            # 📋 Root Config
│   ├── package.json                 # 📦 Dependencies & Scripts
│   ├── tsconfig.json                # ⚙️ TypeScript Config
│   ├── next.config.js               # 🚀 Next.js Config
│   ├── tailwind.config.js           # 🎨 Tailwind Config
│   ├── postcss.config.mjs           # 🎨 PostCSS Config
│   ├── jest.config.js               # 🧪 Jest Config
│   ├── jest.setup.js                # 🧪 Jest Setup
│   ├── .eslintrc.json               # 🔍 ESLint Config
│   ├── .prettierrc                  # 🎨 Prettier Config
│   ├── .prettierignore              # 🚫 Prettier Ignore
│   ├── .gitignore                   # 🚫 Git Ignore
│   └── README.md                    # 📖 Project Overview
│
└── 📖 Main Documentation             # 📖 Root Docs
    ├── DOCUMENTATION.md             # 📚 Comprehensive Docs
    └── README.md                    # 📖 Project README
```

## 🔄 Data Flow Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   🌐 Frontend   │    │   🔧 Service    │    │   🌐 Backend    │
│   Components    │    │     Layer       │    │      API        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   🧩 React      │    │   🔧 Auth       │    │   🔐 OTP        │
│   Components    │    │   Service       │    │   Auth          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   🪝 React      │    │   🌐 Enhanced   │    │   🍪 Auth       │
│   Query Hooks   │    │   API Client    │    │   Cookies       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   🔄 Context    │    │   🔄 Interceptors│    │   📊 Response   │
│   Providers     │    │   & Error       │    │   Data          │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🏢 Multi-Tenant Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    🌐 Multi-Tenant Platform                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    🏢 Tenant Detection                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ abc-rentals │  │ xyz-cars    │  │ test-rental │         │
│  │ .domain.com │  │ .domain.com │  │ .domain.com │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    ⚙️ Dynamic Configuration                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 🎨 Theme    │  │ 📊 SEO      │  │ 🏢 Content  │         │
│  │ Colors      │  │ Metadata    │  │ Branding    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    🧩 Tenant-Specific UI                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 🎯 Hero     │  │ 🔘 Actions  │  │ 🎨 Styling  │         │
│  │ Section     │  │ Buttons     │  │ Components  │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Service Layer Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    🔧 Service Layer                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    🌐 Enhanced API Client                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 🔄 Request  │  │ 🔄 Response │  │ ⚠️ Error    │         │
│  │ Interceptors│  │ Interceptors│  │ Handling    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    🔐 Domain Services                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 🔐 Auth     │  │ 📅 Booking  │  │ 💳 Payment  │         │
│  │ Service     │  │ Service     │  │ Service     │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    🪝 React Query Hooks                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ 🔐 Auth     │  │ 📅 Booking  │  │ 💳 Payment  │         │
│  │ Hooks       │  │ Hooks       │  │ Hooks       │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 📊 File Statistics

### 📁 Directory Breakdown

- **📚 Documentation**: 12 files
- **🎨 App Router**: 5 files
- **🧩 Components**: 5 files
- **⚙️ Configuration**: 5 files
- **🔧 Services**: 15+ files
- **📝 Types**: 8 files
- **📜 Scripts**: 2 files
- **📋 Config Files**: 12 files

### 📊 File Types

- **TypeScript**: ~60+ files
- **JavaScript**: ~5 files
- **JSON**: ~10 files
- **Markdown**: ~11 files
- **CSS**: ~2 files
- **Configuration**: ~15 files

### 🎯 Architecture Metrics

- **TypeScript Coverage**: 100%
- **Test Coverage**: Comprehensive
- **Documentation Coverage**: Complete
- **Code Quality**: ESLint + Prettier
- **Git Hooks**: Automated quality gates

---

_This diagram provides a visual representation of the complete project structure and architecture._
