/**
 * Products hooks following the three-layer hook architecture
 * 1. Data Layer - React Query hooks for API operations
 * 2. Business Logic Layer - Custom hooks that orchestrate operations
 * 3. UI Layer - Components that consume business logic hooks
 */
'use client'

// Removed useAuth - cart-only app
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useMemo, useState } from 'react'
import {
  CreateProductRequest,
  ProductQueryParams,
  ProductSearchParams,
  UpdateProductRequest,
} from '../../types/products.types'
import { productsService } from '../products/products-service'

// Query keys for React Query
export const productsKeys = {
  all: ['products'] as const,
  lists: () => [...productsKeys.all, 'list'] as const,
  list: (params: ProductQueryParams) =>
    [...productsKeys.lists(), params] as const,
  details: () => [...productsKeys.all, 'detail'] as const,
  detail: (id: number) => [...productsKeys.details(), id] as const,
  search: (params: ProductSearchParams) =>
    [...productsKeys.all, 'search', params] as const,
  categories: () => [...productsKeys.all, 'categories'] as const,
  categoryList: () => [...productsKeys.all, 'categoryList'] as const,
  byCategory: (category: string, params?: Omit<ProductQueryParams, 'category'>) =>
    [...productsKeys.all, 'byCategory', category, params] as const,
}

// ============================================================================
// 1. DATA LAYER - React Query Hooks
// ============================================================================

/**
 * Get paginated products query hook
 * Provides basic query functionality with React Query
 */
export function useProducts(params?: ProductQueryParams) {
  const query = useQuery({
    queryKey: productsKeys.list(params || {}),
    queryFn: () => productsService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })

  // Handle errors
  if (query.error) {
    console.error('Products query error:', query.error)
  }

  return {
    products: query.data?.products || [],
    total: query.data?.total || 0,
    skip: query.data?.skip || 0,
    limit: query.data?.limit || 30,
    isLoading: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Get single product query hook
 */
export function useProduct(id: number) {
  const query = useQuery({
    queryKey: productsKeys.detail(id),
    queryFn: () => productsService.getProduct(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })

  // Handle errors
  if (query.error) {
    console.error('Product query error:', query.error)
  }

  return {
    product: query.data,
    isLoading: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Search products query hook
 */
export function useProductSearch(params: ProductSearchParams) {
  // Removed useAuth - cart-only app

  const query = useQuery({
    queryKey: productsKeys.search(params),
    queryFn: () => productsService.searchProducts(params),
    enabled: !!params.q,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })

  // Handle errors
  if (query.error) {
    console.error('Query error:', query.error)
  }

  return {
    products: query.data?.products || [],
    total: query.data?.total || 0,
    skip: query.data?.skip || 0,
    limit: query.data?.limit || 30,
    isLoading: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Get product categories query hook
 */
export function useProductCategories() {
  // Removed useAuth - cart-only app

  const query = useQuery({
    queryKey: productsKeys.categories(),
    queryFn: () => productsService.getCategories(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  })

  // Handle errors
  if (query.error) {
    console.error('Query error:', query.error)
  }

  return {
    categories: query.data || [],
    isLoading: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Get product category list query hook
 */
export function useProductCategoryList() {
  // Removed useAuth - cart-only app

  const query = useQuery({
    queryKey: productsKeys.categoryList(),
    queryFn: () => productsService.getCategoryList(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  })

  // Handle errors
  if (query.error) {
    console.error('Query error:', query.error)
  }

  return {
    categoryList: query.data || [],
    isLoading: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Get products by category query hook
 */
export function useProductsByCategory(
  category: string,
  params?: Omit<ProductQueryParams, 'category'>,
) {
  // Removed useAuth - cart-only app

  const query = useQuery({
    queryKey: productsKeys.byCategory(category, params),
    queryFn: () => productsService.getProductsByCategory(category, params),
    enabled: !!category,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })

  // Handle errors
  if (query.error) {
    console.error('Query error:', query.error)
  }

  return {
    products: query.data?.products || [],
    total: query.data?.total || 0,
    skip: query.data?.skip || 0,
    limit: query.data?.limit || 30,
    isLoading: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Create product mutation hook
 */
export function useCreateProduct() {
  // Removed useAuth - cart-only app
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateProductRequest) => {
      return productsService.createProduct(data)
    },
    onSuccess: response => {
      // Invalidate and refetch products list
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() })
      console.log('Product created successfully:', response)
    },
    onError: (error: Error) => {
      console.error('Failed to create product:', error.message)
    },
  })

  return {
    createProduct: mutation.mutate,
    createProductAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Update product mutation hook
 */
export function useUpdateProduct() {
  // Removed useAuth - cart-only app
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductRequest }) => {
      return productsService.updateProduct(id, data)
    },
    onSuccess: (response, variables) => {
      // Update the specific product in cache
      queryClient.setQueryData(productsKeys.detail(variables.id), response)
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() })
      console.log('Product updated successfully:', response)
    },
    onError: (error: Error) => {
      console.error('Failed to update product:', error.message)
    },
  })

  return {
    updateProduct: mutation.mutate,
    updateProductAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Delete product mutation hook
 */
export function useDeleteProduct() {
  // Removed useAuth - cart-only app
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (id: number) => {
      return productsService.deleteProduct(id)
    },
    onSuccess: (_, id) => {
      // Remove the product from cache
      queryClient.removeQueries({ queryKey: productsKeys.detail(id) })
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: productsKeys.lists() })
      console.log('Product deleted successfully:', id)
    },
    onError: (error: Error) => {
      console.error('Failed to delete product:', error.message)
    },
  })

  return {
    deleteProduct: mutation.mutate,
    deleteProductAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}

// ============================================================================
// 2. BUSINESS LOGIC LAYER - Custom Hooks
// ============================================================================

/**
 * Comprehensive products management hook
 * Combines multiple operations for complex UI scenarios
 */
export function useProductsManagement() {
  const {
    products,
    total,
    skip,
    limit,
    isLoading: isLoadingProducts,
    error: productsError,
    refetch: refetchProducts,
  } = useProducts()

  const {
    createProduct,
    createProductAsync,
    isLoading: isCreating,
    error: createError,
    reset: resetCreate,
  } = useCreateProduct()

  const {
    updateProduct,
    updateProductAsync,
    isLoading: isUpdating,
    error: updateError,
    reset: resetUpdate,
  } = useUpdateProduct()

  const {
    deleteProduct,
    deleteProductAsync,
    isLoading: isDeleting,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteProduct()

  // Computed values
  const isLoading = isLoadingProducts || isCreating || isUpdating || isDeleting
  const hasError = !!(productsError || createError || updateError || deleteError)

  // Combined error handling
  const error = productsError || createError || updateError || deleteError

  // Business logic methods
  const handleCreateProduct = async (data: CreateProductRequest) => {
    try {
      const result = await createProductAsync(data)
      return result
    } catch (error) {
      console.error('Failed to create product:', error)
      throw error
    }
  }

  const handleUpdateProduct = async (id: number, data: UpdateProductRequest) => {
    try {
      const result = await updateProductAsync({ id, data })
      return result
    } catch (error) {
      console.error('Failed to update product:', error)
      throw error
    }
  }

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProductAsync(id)
    } catch (error) {
      console.error('Failed to delete product:', error)
      throw error
    }
  }

  return {
    // Data
    products,
    total,
    skip,
    limit,

    // Loading states
    isLoading,
    isLoadingProducts,
    isCreating,
    isUpdating,
    isDeleting,

    // Error states
    hasError,
    error,
    productsError,
    createError,
    updateError,
    deleteError,

    // Actions
    refetchProducts,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,

    // Reset functions
    resetCreate,
    resetUpdate,
    resetDelete,
  }
}

/**
 * Products listing hook with pagination and filtering
 */
export function useProductsListing(initialParams?: ProductQueryParams) {
  const [params, setParams] = useState<ProductQueryParams>(initialParams || {})
  
  const {
    products,
    total,
    skip,
    limit,
    isLoading,
    error,
    refetch,
  } = useProducts(params)

  // Calculate current page from the original params, not from skip
  const currentPage = params.page || Math.floor(skip / limit) + 1
  const totalPages = Math.ceil(total / limit)
  const hasNext = (params.page || 1) < totalPages
  const hasPrev = (params.page || 1) > 1

  // Navigation methods - work with page parameter
  const goToPage = (page: number) => {
    setParams(prev => ({ ...prev, page }))
  }

  const nextPage = () => {
    if (hasNext) {
      goToPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (hasPrev) {
      goToPage(currentPage - 1)
    }
  }

  const updateParams = (newParams: Partial<ProductQueryParams>) => {
    setParams(prev => ({ ...prev, ...newParams, page: 1 })) // Reset to first page
  }

  return {
    // Data
    products,
    total,
    skip,
    limit,
    currentPage,
    totalPages,
    hasNext,
    hasPrev,

    // Loading and error states
    isLoading,
    error,

    // Actions
    refetch,
    goToPage,
    nextPage,
    prevPage,
    updateParams,
    setParams,
  }
}

/**
 * Product search hook with debouncing
 */
export function useProductSearchDebounced(searchQuery: string, debounceMs = 300) {
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery)

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [searchQuery, debounceMs])

  const {
    products,
    total,
    isLoading,
    error,
    refetch,
  } = useProductSearch({ q: debouncedQuery })

  return {
    products,
    total,
    isLoading,
    error,
    refetch,
    searchQuery: debouncedQuery,
  }
}
