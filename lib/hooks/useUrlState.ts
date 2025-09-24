/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * URL State Management Hooks using nuqs
 * Provides type-safe URL state management for the multi-tenant application
 */
'use client'

import { useQueryState, useQueryStates } from 'nuqs'
import { z } from 'zod'

// Zod schemas for URL parameter validation
const SearchSchema = z.object({
  q: z.string().optional(),
  category: z.enum(['cars', 'bikes', 'equipment']).optional(),
  price_min: z.coerce.number().min(0).optional(),
  price_max: z.coerce.number().min(0).optional(),
  sort: z.enum(['price_asc', 'price_desc', 'name_asc', 'name_desc']).optional(),
})

const FilterSchema = z.object({
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1)
    .optional(),
  transmission: z.enum(['manual', 'automatic']).optional(),
  fuel_type: z.enum(['petrol', 'diesel', 'electric', 'hybrid']).optional(),
})

const PaginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
})

const AuthSchema = z.object({
  redirect: z.string().optional(),
  callback: z.string().optional(),
})

// Type definitions
export type SearchParams = z.infer<typeof SearchSchema>
export type FilterParams = z.infer<typeof FilterSchema>
export type PaginationParams = z.infer<typeof PaginationSchema>
export type AuthParams = z.infer<typeof AuthSchema>

/**
 * Hook for managing search parameters in URL
 * Automatically syncs with URL and provides type-safe access
 */
export function useSearchState() {
  return useQueryStates({
    q: {
      defaultValue: '',
      parse: value => value || '',
      serialize: value => value || undefined,
    },
    category: {
      defaultValue: undefined,
      parse: value => value as SearchParams['category'],
      serialize: value => value || undefined,
    },
    price_min: {
      defaultValue: undefined,
      parse: value => (value ? Number(value) : undefined),
      serialize: value => value?.toString() || undefined,
    },
    price_max: {
      defaultValue: undefined,
      parse: value => (value ? Number(value) : undefined),
      serialize: value => value?.toString() || undefined,
    },
    sort: {
      defaultValue: 'name_asc' as const,
      parse: value => value as SearchParams['sort'],
      serialize: value => value || undefined,
    },
  })
}

/**
 * Hook for managing filter parameters in URL
 * Provides advanced filtering options for vehicle search
 */
export function useFilterState() {
  return useQueryStates({
    brand: {
      defaultValue: undefined,
      parse: value => value || undefined,
      serialize: value => value || undefined,
    },
    model: {
      defaultValue: undefined,
      parse: value => value || undefined,
      serialize: value => value || undefined,
    },
    year: {
      defaultValue: undefined,
      parse: value => (value ? Number(value) : undefined),
      serialize: value => value?.toString() || undefined,
    },
    transmission: {
      defaultValue: undefined,
      parse: value => value as FilterParams['transmission'],
      serialize: value => value || undefined,
    },
    fuel_type: {
      defaultValue: undefined,
      parse: value => value as FilterParams['fuel_type'],
      serialize: value => value || undefined,
    },
  })
}

/**
 * Hook for managing pagination parameters in URL
 * Handles page navigation and items per page
 */
export function usePaginationState() {
  return useQueryStates({
    page: {
      defaultValue: 1,
      parse: value => (value ? Number(value) : 1),
      serialize: value => value.toString(),
    },
    limit: {
      defaultValue: 20,
      parse: value => (value ? Number(value) : 20),
      serialize: value => value.toString(),
    },
  })
}

/**
 * Hook for managing authentication-related URL parameters
 * Handles redirect URLs and callback URLs for auth flows
 */
export function useAuthState() {
  return useQueryStates({
    redirect: {
      defaultValue: undefined,
      parse: value => value || undefined,
      serialize: value => value || undefined,
    },
    callback: {
      defaultValue: undefined,
      parse: value => value || undefined,
      serialize: value => value || undefined,
    },
  })
}

/**
 * Hook for managing view mode (grid/list) in URL
 * Useful for product listing pages
 */
export function useViewModeState() {
  return useQueryState('view', {
    defaultValue: 'grid' as const,
    parse: value => (value === 'list' ? 'list' : 'grid'),
    serialize: value => value,
  })
}

/**
 * Hook for managing tenant-specific URL parameters
 * Allows tenants to customize URL behavior
 */
export function useTenantState() {
  return useQueryStates({
    tenant_id: {
      defaultValue: undefined,
      parse: value => value || undefined,
      serialize: value => value || undefined,
    },
    locale: {
      defaultValue: 'en',
      parse: value => value || 'en',
      serialize: value => value,
    },
  })
}

/**
 * Utility hook to clear all search and filter parameters
 * Useful for reset functionality
 */
export function useClearFilters() {
  const [searchState, setSearchState] = useSearchState()
  const [filterState, setFilterState] = useFilterState()
  const [paginationState, setPaginationState] = usePaginationState()

  const clearAllFilters = () => {
    setSearchState({
      q: '',
      category: undefined,
      price_min: undefined,
      price_max: undefined,
      sort: 'name_asc',
    })
    setFilterState({
      brand: undefined,
      model: undefined,
      year: undefined,
      transmission: undefined,
      fuel_type: undefined,
    })
    setPaginationState({
      page: 1,
      limit: 20,
    })
  }

  return {
    clearAllFilters,
    hasActiveFilters: Boolean(
      searchState.q ||
        searchState.category ||
        searchState.price_min ||
        searchState.price_max ||
        filterState.brand ||
        filterState.model ||
        filterState.year ||
        filterState.transmission ||
        filterState.fuel_type,
    ),
  }
}

/**
 * Hook for managing booking flow state in URL
 * Tracks user progress through booking process
 */
export function useBookingState() {
  return useQueryStates({
    step: {
      defaultValue: 'select' as const,
      parse: value =>
        value as 'select' | 'details' | 'payment' | 'confirmation',
      serialize: value => value,
    },
    vehicle_id: {
      defaultValue: undefined,
      parse: value => value || undefined,
      serialize: value => value || undefined,
    },
    start_date: {
      defaultValue: undefined,
      parse: value => value || undefined,
      serialize: value => value || undefined,
    },
    end_date: {
      defaultValue: undefined,
      parse: value => value || undefined,
      serialize: value => value || undefined,
    },
  })
}

/**
 * Hook for managing user preferences in URL
 * Allows users to customize their experience
 */
export function usePreferencesState() {
  return useQueryStates({
    theme: {
      defaultValue: 'system' as const,
      parse: value => value as 'light' | 'dark' | 'system',
      serialize: value => value,
    },
    currency: {
      defaultValue: 'USD',
      parse: value => value || 'USD',
      serialize: value => value,
    },
    language: {
      defaultValue: 'en',
      parse: value => value || 'en',
      serialize: value => value,
    },
  })
}
