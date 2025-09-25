# Products Storefront

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit the application
open http://localhost:3000                    # Home page
open http://localhost:3000/products          # Product catalog
open http://localhost:3000/cart             # Shopping cart
```

A modern, high-performance e-commerce storefront built with **Next.js 15**, **shadcn/ui**, **Tailwind CSS v4**, and **Zustand**. Features product listings, detailed product pages, shopping cart functionality, and responsive design optimized for mobile-first experiences.

## ✨ Features

- **🛍️ Product Catalog**: Browse products with search, filtering, and pagination
- **📱 Product Details**: Rich product pages with image galleries and reviews
- **🛒 Shopping Cart**: Persistent cart with quantity controls and animations
- **🎨 Modern UI**: Beautiful, accessible components with shadcn/ui
- **📱 Mobile-First**: Responsive design optimized for all devices
- **⚡ Performance**: ISR for product pages with optimal caching
- **🔧 Type Safe**: Full TypeScript implementation with strict types
- **🔄 State Management**: Zustand for cart state with persistence
- **🎯 Real-time Updates**: Cart badge animations and toast notifications


## 🛍️ Product Features

### Product Catalog
- **Search & Filter**: Find products by name, category, or price range
- **Pagination**: Navigate through large product catalogs efficiently
- **Responsive Grid**: Mobile-first design with card and list views
- **Real-time Updates**: Instant search results with debounced input

### Product Details
- **Rich Media**: High-quality product images with thumbnail navigation
- **Detailed Information**: Specifications, reviews, and pricing
- **Quantity Controls**: Add multiple items with intuitive controls
- **Stock Management**: Real-time stock availability and limits

### Shopping Cart
- **Persistent State**: Cart items saved across browser sessions
- **Quantity Management**: Update quantities with +/- controls
- **Price Calculations**: Automatic totals with discount support
- **Visual Feedback**: Animated cart badge and toast notifications

## 🏗️ Architecture

### Rendering Strategies

| Content Type    | Strategy | Cache Duration | Use Case                         |
| --------------- | -------- | -------------- | -------------------------------- |
| Product pages   | **ISR**  | 1 hour         | Product details, periodic updates |
| Static pages    | **SSG**  | Build time     | Home, about, terms               |
| Cart pages      | **SSR**  | Real-time      | User-specific cart state         |

### State Management

```
🔄 Zustand Store
├── 🛒 Cart State (items, quantities, totals)
├── 💾 Local Storage Persistence
├── 🎯 Reactive Updates
└── 🎨 UI State (loading, errors)
```

### Component Architecture

```
📦 shadcn/ui Components
├── 🎨 Consistent design system
├── ♿ Built-in accessibility features
├── 🎯 Type-safe props
└── 📱 Mobile-first responsive design
```

## 🚀 How to Run Locally

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation & Setup

```bash
# Clone the repository
git clone <repository-url>
cd products-storefront

# Install dependencies
npm install

# Start development server
npm run dev

# Open in browser
open http://localhost:3000
```

### Development Commands

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
```

## 🗂️ Project Structure

```
products-storefront/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx         # Public layout with header
│   │   ├── page.tsx          # Home page
│   │   ├── products/         # Product pages (ISR)
│   │   └── cart/            # Cart page (SSR)
│   ├── layout.tsx            # Root layout with providers
│   └── globals.css           # Global styles + animations
├── components/
│   ├── features/
│   │   ├── products/        # Product components
│   │   └── cart/           # Cart components
│   ├── header/             # Navigation components
│   ├── providers/          # Context providers
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── services/          # API services & hooks
│   ├── stores/           # Zustand store
│   ├── types/            # TypeScript definitions
│   └── utils/            # Helper functions
├── middleware.ts          # Route handling
└── next.config.js        # Next.js configuration
```

## 🛠️ Tech Stack

### Core Framework
- **[Next.js 15](https://nextjs.org)** - App Router with server components
- **[React 18](https://react.dev)** - Concurrent features and hooks
- **[TypeScript](https://typescriptlang.org)** - Type-safe development

### UI & Styling
- **[Tailwind CSS v4](https://tailwindcss.com)** - Utility-first CSS
- **[shadcn/ui](https://ui.shadcn.com)** - Accessible component library
- **Mobile-First Design** - Responsive layouts and touch-friendly interactions

### State Management
- **[Zustand](https://zustand-demo.pmnd.rs)** - Lightweight state management
- **Local Storage** - Cart persistence across sessions
- **React Query** - Server state management and caching

### Data & API
- **[DummyJSON](https://dummyjson.com)** - Product data API
- **React Query** - Data fetching, caching, and synchronization
- **Service Layer** - Clean API abstraction

## 💭 Thought Process & Trade-offs

### Design Decisions

**1. Products-Only Focus**
- **Decision**: Simplified from multi-tenant to single-purpose storefront
- **Rationale**: Focus on core e-commerce functionality without complexity
- **Trade-off**: Less flexible but more maintainable and performant

**2. Zustand for Cart State**
- **Decision**: Chose Zustand over Redux Toolkit or Context API
- **Rationale**: Lightweight, simple API, excellent TypeScript support
- **Trade-off**: Less ecosystem than Redux, but simpler mental model

**3. ISR for Product Pages**
- **Decision**: Used ISR (1-hour revalidation) for product detail pages
- **Rationale**: Balance between performance and data freshness
- **Trade-off**: Slight delay in updates vs. better performance

**4. Mobile-First Design**
- **Decision**: Prioritized mobile experience over desktop
- **Rationale**: Most e-commerce traffic is mobile, better UX
- **Trade-off**: More complex responsive code, but better user experience

**5. Service Layer Architecture**
- **Decision**: Three-layer architecture (API → Service → Hooks)
- **Rationale**: Clean separation, testable, maintainable
- **Trade-off**: More boilerplate, but better organization

### Technical Trade-offs

**Performance vs. Features**
- ✅ **Chose**: ISR caching for performance
- ❌ **Sacrificed**: Real-time updates for better loading speeds

**Simplicity vs. Flexibility**
- ✅ **Chose**: Single-purpose storefront
- ❌ **Sacrificed**: Multi-tenant flexibility for maintainability

**State Management**
- ✅ **Chose**: Zustand for simplicity
- ❌ **Sacrificed**: Redux ecosystem for lighter bundle

## ⚠️ Known Limitations

### Current Limitations

**1. No User Authentication**
- **Impact**: No user accounts, order history, or personalized features
- **Workaround**: Cart persists in localStorage only
- **Future**: Could add auth with NextAuth.js or similar

**2. No Payment Processing**
- **Impact**: No checkout functionality beyond cart management
- **Workaround**: Cart is ready for payment integration
- **Future**: Could integrate Stripe, PayPal, or other payment providers

**3. No Inventory Management**
- **Impact**: Stock levels are display-only, no real inventory tracking
- **Workaround**: Uses DummyJSON stock data
- **Future**: Could add real inventory API integration

**4. No Order Management**
- **Impact**: No order creation, tracking, or management
- **Workaround**: Focus on product browsing and cart functionality
- **Future**: Could add order management system

**5. Limited Product Data**
- **Impact**: Uses DummyJSON API with limited product information
- **Workaround**: Good for demo, but limited real-world data
- **Future**: Could integrate with real e-commerce APIs

### Performance Considerations

**1. Image Optimization**
- **Current**: Basic Next.js Image optimization
- **Limitation**: No advanced image processing or CDN
- **Future**: Could add Cloudinary or similar service

**2. Search Performance**
- **Current**: Client-side search with debouncing
- **Limitation**: No server-side search or advanced filtering
- **Future**: Could add Elasticsearch or Algolia integration

**3. Caching Strategy**
- **Current**: ISR with 1-hour revalidation
- **Limitation**: No advanced cache invalidation
- **Future**: Could add more sophisticated caching strategies

## 🎯 Key Features Implemented

### ✅ Completed Features
- **Product Catalog**: Search, filter, pagination, and responsive grid/list views
- **Product Details**: Rich product pages with image galleries and reviews
- **Shopping Cart**: Persistent cart with quantity controls and animations
- **Mobile-First UI**: Responsive design with touch-friendly interactions
- **State Management**: Zustand store with localStorage persistence
- **Performance**: ISR caching for optimal loading speeds
- **Type Safety**: Full TypeScript implementation

### 🔄 Recent Improvements
- **Cart Header Updates**: Fixed reactive cart badge updates
- **Toast Notifications**: Enhanced user feedback for cart actions
- **Mobile Navigation**: Responsive header with cart badge animations
- **Hydration Fixes**: Resolved server-client rendering mismatches

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Next.js 15, shadcn/ui, Tailwind CSS v4, and Zustand**
