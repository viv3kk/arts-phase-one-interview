# InstaShop - Multi-Tenant E-commerce Storefront

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/viv3kk/arts-phase-one-interview.git)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://arts-phase-one-interview.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://typescriptlang.org)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/viv3kk/arts-phase-one-interview.git
cd arts-phase-one-interview

# Install dependencies
npm install

# Start development server
npm run dev

# Visit the application
open http://localhost:3000                    # Home page (InstaShop)
open http://localhost:3000/products          # Product catalog
open http://localhost:3000/cart             # Shopping cart

# Production Vercel domains
open https://arts-phase-one-interview.vercel.app # Default (Ocean theme)
```

A modern, high-performance multi-tenant e-commerce storefront built with **Next.js 15**, **shadcn/ui**, **Tailwind CSS v4**, and **Zustand**. Features dynamic theming, product listings, detailed product pages, shopping cart functionality, and responsive design optimized for mobile-first experiences.

## 🎯 Feature Implementation Status

### ✅ **Implemented Features**

#### **🏢 Multi-Tenant System**
- ✅ **Dynamic Theming**: CSS custom properties for tenant-specific themes
- ✅ **Subdomain Routing**: `abc-rentals.localhost:3000` → InstaShop tenant
- ✅ **Tenant Configuration**: JSON-based tenant management
- ✅ **Theme Switching**: Ocean, Fire, Forest themes
- ✅ **Brand Customization**: Tenant-specific content and metadata

#### **🛍️ Product Catalog**
- ✅ **Product Listing**: Grid and list view modes
- ✅ **Search Functionality**: Real-time product search with debouncing
- ✅ **Pagination**: Navigate through product pages
- ✅ **Responsive Design**: Mobile-first grid layouts
- ✅ **Loading States**: Skeleton components during data fetching
- ✅ **Error Handling**: Graceful error states and fallbacks

#### **📱 Product Details**
- ✅ **Product Information**: Title, price, description, specifications
- ✅ **Image Gallery**: Main image with thumbnail navigation
- ✅ **Stock Status**: Real-time stock availability
- ✅ **Quantity Controls**: Add to cart with quantity selection
- ✅ **Product Reviews**: Display customer reviews and ratings
- ✅ **Warranty & Shipping**: Additional product information

#### **🛒 Shopping Cart**
- ✅ **Add to Cart**: Add products with quantity selection
- ✅ **Cart Persistence**: localStorage-based cart state
- ✅ **Quantity Management**: Update quantities with +/- controls
- ✅ **Cart Badge**: Real-time cart item count in header
- ✅ **Toast Notifications**: User feedback for cart actions
- ✅ **Price Calculations**: Automatic totals and discounts

#### **🎨 UI/UX**
- ✅ **shadcn/ui Components**: Consistent, accessible component library
- ✅ **Mobile-First Design**: Touch-friendly interactions
- ✅ **Responsive Layout**: Works on all screen sizes
- ✅ **Loading States**: Skeleton components and spinners
- ✅ **Error Boundaries**: Graceful error handling
- ✅ **Accessibility**: ARIA labels and keyboard navigation

#### **⚡ Performance**
- ✅ **ISR Caching**: Product pages with 1-hour revalidation
- ✅ **Server Components**: Default to server-side rendering
- ✅ **Code Splitting**: Lazy loading for non-critical components
- ✅ **Image Optimization**: Next.js Image component
- ✅ **Bundle Optimization**: Tree-shaking and minimal dependencies

#### **🔧 Technical**
- ✅ **TypeScript**: Full type safety with strict configuration
- ✅ **State Management**: Zustand for client state
- ✅ **React Query**: Server state management and caching
- ✅ **Service Layer**: Clean API abstraction
- ✅ **Component Architecture**: Composable, reusable components

### 🚧 **To Be Implemented**

#### **🔍 Advanced Product Features**
- ❌ **Product Filters**: Category, price range, brand filtering
- ❌ **Sort Options**: Sort by price, name, rating, date
- ❌ **Advanced Search**: Search by multiple criteria
- ❌ **Product Comparison**: Compare multiple products
- ❌ **Wishlist/Favorites**: Save products for later
- ❌ **Product Recommendations**: "You might also like" suggestions

#### **🛒 Enhanced Cart & Checkout**
- ❌ **Guest Checkout**: Checkout without account creation
- ❌ **Shipping Calculator**: Real-time shipping cost calculation
- ❌ **Coupon Codes**: Discount code application
- ❌ **Cart Abandonment**: Save cart for later functionality
- ❌ **Bulk Operations**: Add multiple items at once

#### **👤 User Management**
- ❌ **User Authentication**: Login/register system
- ❌ **User Profiles**: Account management and preferences
- ❌ **Order History**: Past purchase tracking
- ❌ **Address Book**: Saved shipping addresses
- ❌ **Wishlist**: Personal product wishlist

#### **💳 Payment & Orders**
- ❌ **Payment Processing**: Stripe, PayPal integration
- ❌ **Order Management**: Order creation and tracking
- ❌ **Invoice Generation**: Order receipts and invoices
- ❌ **Order Status**: Real-time order tracking
- ❌ **Refund System**: Return and refund processing

#### **📊 Analytics & SEO**
- ❌ **Product Analytics**: View tracking and conversion metrics
- ❌ **SEO Optimization**: Meta tags, structured data
- ❌ **Search Engine**: Advanced product search indexing
- ❌ **Performance Monitoring**: Core Web Vitals tracking
- ❌ **A/B Testing**: Feature flag system

#### **🔧 Admin Features**
- ❌ **Product Management**: Admin dashboard for products
- ❌ **Inventory Management**: Stock level tracking
- ❌ **Order Management**: Admin order processing
- ❌ **User Management**: Customer account administration
- ❌ **Analytics Dashboard**: Business metrics and reporting

### 🔄 **Recent Improvements**

- **Component Refactoring**: Extracted ProductDetail and ProductListing into organized folders
- **Multi-Tenant Branding**: Updated all ABC Rental references to InstaShop
- **Home Page Cleanup**: Simplified home page template with InstaShop branding
- **Import Path Updates**: Fixed all import paths after component reorganization
- **Code Quality**: Applied Prettier formatting and resolved linting issues

## ✨ Features

- **🏢 Multi-Tenant Architecture**: Dynamic theming and branding per tenant
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

### Multi-Tenant System

| Tenant | Local Development | Production (Vercel) | Theme | Brand |
|--------|------------------|---------------------|-------|-------|
| InstaShop | `abc-rentals.localhost:3000` | `arts-shop.vercel.app` | Fire | InstaShop |
| Default | `localhost:3000` | `arts-phase-one-interview.vercel.app` | Ocean | Default |

### Rendering Strategies

| Content Type  | Strategy | Cache Duration | Use Case                          |
| ------------- | -------- | -------------- | --------------------------------- |
| Product pages | **ISR**  | 1 hour         | Product details, periodic updates |
| Static pages  | **SSG**  | Build time     | Home, about, terms                |
| Cart pages    | **SSR**  | Real-time      | User-specific cart state          |

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
📦 Organized Component Structure
├── 🏢 ProductDetail/          # Product detail components
│   ├── ProductImages/        # Image gallery components
│   ├── ProductInformation/   # Product info components
│   ├── ProductReviews/       # Review components
│   ├── context/              # Context providers
│   └── hooks/                # Custom hooks
├── 🛍️ ProductListing/        # Product listing components
│   ├── ProductFilters/       # Filter components
│   ├── ProductCard/          # Product card component
│   └── ProductPagination/    # Pagination components
└── 🎨 shadcn/ui Components   # Base UI components
    ├── 🎨 Consistent design system
    ├── ♿ Built-in accessibility features
    ├── 🎯 Type-safe props
    └── 📱 Mobile-first responsive design
```

## 🚀 How to Run Locally

### Prerequisites

- Node.js 18+
- npm or yarn


```

### Development Commands

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking

# Deploy to Vercel
npm run build           # Build for production
vercel deploy           # Deploy to Vercel
```

### Production URLs

- **Arts Phase One (Ocean Theme)**: https://arts-phase-one-interview.vercel.app

## 🗂️ Project Structure

```
instashop-storefront/
├── app/
│   ├── (public)/
│   │   ├── layout.tsx         # Public layout with header
│   │   ├── page.tsx          # Home page (InstaShop branding)
│   │   ├── products/         # Product pages (ISR)
│   │   └── cart/            # Cart page (SSR)
│   ├── layout.tsx            # Root layout with providers
│   └── globals.css           # Global styles + theme tokens
├── components/
│   ├── features/
│   │   └── products/        # Product components
│   │       ├── ProductDetail/    # Product detail components
│   │       │   ├── ProductImages/    # Image gallery
│   │       │   ├── ProductInformation/ # Product info
│   │       │   ├── ProductReviews/    # Reviews
│   │       │   ├── context/           # Context providers
│   │       │   └── hooks/             # Custom hooks
│   │       └── ProductListing/    # Product listing components
│   │           ├── ProductFilters/    # Filter components
│   │           ├── ProductCard/       # Product cards
│   │           └── ProductPagination/ # Pagination
│   ├── header/             # Navigation components
│   ├── providers/          # Context providers
│   └── ui/                # shadcn/ui components
├── config/
│   ├── tenants.json       # Tenant registry
│   └── tenants/          # Tenant configurations
│       ├── default.json   # Default tenant
│       ├── abc-rentals.json # InstaShop (Fire theme)
│       ├── xyz-cars.json  # XYZ Cars (Forest theme)
│       ├── arts-shop.json # InstaShop (Fire theme) - Vercel
│       └── arts-phase-one-interview.json # Arts Phase One (Ocean theme) - Vercel
├── lib/
│   ├── services/          # API services & hooks
│   ├── stores/           # Zustand store
│   ├── types/            # TypeScript definitions
│   ├── themes/           # Theme configurations
│   └── utils/            # Helper functions
├── middleware.ts          # Multi-tenant routing
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

### Multi-Tenant Features

- **Dynamic Theming** - CSS custom properties for tenant-specific themes
- **Subdomain Routing** - Tenant detection via middleware
- **Tenant Configuration** - JSON-based tenant management
- **Brand Customization** - Tenant-specific content and metadata

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


## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**InstaShop - Built with ❤️ using Next.js 15, shadcn/ui, Tailwind CSS v4, and Zustand**
