# Nuqs Integration

## Overview

This project integrates [nuqs](https://nuqs.47ng.com/) for type-safe URL state management, following the Next.js App Router adapter pattern. Nuqs provides a clean way to manage URL query parameters with full TypeScript support and automatic URL synchronization.

## Installation & Setup

### 1. Package Installation

```bash
npm install nuqs
```

### 2. Adapter Integration

The `NuqsAdapter` is integrated in the root layout following the [official Next.js App Router pattern](https://nuqs.47ng.com/docs/adapters#nextjs-app-router):

```typescript
// app/layout.tsx
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <body>
        <NuqsAdapter>
          <Providers>
            <TenantProvider initialConfig={config}>
              <ThemeProvider>{children}</ThemeProvider>
            </TenantProvider>
          </Providers>
        </NuqsAdapter>
      </body>
    </html>
  )
}
```

## URL State Management Hooks

### Core Hooks

#### `useSearchState()`

Manages search parameters in URL:

- `q` - Search query string
- `category` - Vehicle category (cars, bikes, equipment)
- `price_min` / `price_max` - Price range filters
- `sort` - Sort order (price_asc, price_desc, name_asc, name_desc)

#### `useFilterState()`

Manages advanced filter parameters:

- `brand` - Vehicle brand
- `model` - Vehicle model
- `year` - Manufacturing year
- `transmission` - Manual/Automatic
- `fuel_type` - Petrol, Diesel, Electric, Hybrid

#### `usePaginationState()`

Handles pagination:

- `page` - Current page number
- `limit` - Items per page

#### `useAuthState()`

Manages authentication-related URL parameters:

- `redirect` - Redirect URL after auth
- `callback` - Callback URL for auth flows

#### `useViewModeState()`

Manages view mode (grid/list) for product listings.

#### `useTenantState()`

Handles tenant-specific URL parameters:

- `tenant_id` - Override tenant identification
- `locale` - Language preference

#### `useBookingState()`

Tracks booking flow progress:

- `step` - Current booking step
- `vehicle_id` - Selected vehicle
- `start_date` / `end_date` - Booking dates

#### `usePreferencesState()`

Manages user preferences:

- `theme` - Light/Dark/System
- `currency` - Preferred currency
- `language` - Language preference

### Utility Hooks

#### `useClearFilters()`

Provides utility functions:

- `clearAllFilters()` - Reset all search and filter parameters
- `hasActiveFilters` - Boolean indicating if any filters are active

## Type Safety

All hooks use Zod schemas for runtime validation and TypeScript type inference:

```typescript
const SearchSchema = z.object({
  q: z.string().optional(),
  category: z.enum(['cars', 'bikes', 'equipment']).optional(),
  price_min: z.coerce.number().min(0).optional(),
  price_max: z.coerce.number().min(0).optional(),
  sort: z.enum(['price_asc', 'price_desc', 'name_asc', 'name_desc']).optional(),
})

export type SearchParams = z.infer<typeof SearchSchema>
```

## Usage Patterns

### Basic Usage

```typescript
const [searchState, setSearchState] = useSearchState()

// Update search query
setSearchState({ ...searchState, q: 'toyota' })

// Clear specific filter
setSearchState({ ...searchState, category: undefined })
```

### Multi-Parameter Updates

```typescript
const [filters, setFilters] = useFilterState()

// Update multiple filters at once
setFilters({
  brand: 'Toyota',
  transmission: 'automatic',
  year: 2020,
})
```

### Utility Functions

```typescript
const { clearAllFilters, hasActiveFilters } = useClearFilters()

// Clear all filters and reset to defaults
clearAllFilters()

// Show/hide clear button based on active filters
{hasActiveFilters && <ClearButton onClick={clearAllFilters} />}
```

## Integration with Multi-Tenancy

The URL state management integrates seamlessly with the multi-tenant architecture:

1. **Tenant-Aware Parameters**: `useTenantState()` allows URL-based tenant overrides
2. **Locale Support**: Language preferences are stored in URL for tenant-specific localization
3. **Persistent State**: URL parameters persist across tenant switches
4. **SEO-Friendly**: All search and filter states are bookmarkable and shareable

## Benefits

### 1. **Type Safety**

- Full TypeScript support with Zod validation
- Compile-time error checking for parameter types
- IntelliSense support for all URL parameters

### 2. **URL Synchronization**

- Automatic URL updates when state changes
- Browser back/forward button support
- Bookmarkable and shareable URLs

### 3. **Performance**

- Minimal re-renders with optimized state updates
- Efficient URL parsing and serialization
- SSR/SSG compatible

### 4. **Developer Experience**

- Clean, intuitive API
- Comprehensive error handling
- Built-in validation and type inference

### 5. **User Experience**

- Persistent state across page refreshes
- Shareable filtered search results
- Browser history integration

## Best Practices

### 1. **Parameter Naming**

- Use descriptive, consistent parameter names
- Follow URL-friendly naming conventions
- Avoid conflicts with existing route parameters

### 2. **Default Values**

- Provide sensible defaults for all parameters
- Handle undefined/null values gracefully
- Use type-safe default value handling

### 3. **Validation**

- Use Zod schemas for runtime validation
- Provide meaningful error messages
- Handle edge cases (invalid numbers, enums, etc.)

### 4. **Performance**

- Batch related parameter updates
- Avoid unnecessary URL updates
- Use debouncing for search inputs

### 5. **Accessibility**

- Ensure all form controls have proper labels
- Maintain keyboard navigation support
- Provide clear visual feedback for active filters

## Migration from Manual URL Management

If migrating from manual URL parameter handling:

1. **Replace manual parsing** with nuqs hooks
2. **Update state management** to use URL state instead of local state
3. **Remove manual URL updates** - nuqs handles this automatically
4. **Update form components** to use nuqs state setters
5. **Test URL persistence** and browser navigation

## Troubleshooting

### Common Issues

1. **Parameter not updating**: Check if the parameter is properly defined in the hook
2. **Type errors**: Ensure Zod schema matches the expected parameter types
3. **URL conflicts**: Verify parameter names don't conflict with route parameters
4. **Performance issues**: Use debouncing for frequently changing parameters

### Debug Mode

Enable nuqs debug mode for development:

```typescript
// Add to your development environment
window.__NUQS_DEBUG__ = true
```

## References

- [Nuqs Documentation](https://nuqs.47ng.com/)
- [Next.js App Router Adapter](https://nuqs.47ng.com/docs/adapters#nextjs-app-router)
- [TypeScript Integration](https://nuqs.47ng.com/docs/parsers)
- [Zod Validation](https://zod.dev/)
