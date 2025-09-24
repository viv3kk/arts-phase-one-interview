# Service Layer Development Workflow

This document provides a complete step-by-step guide for adding new APIs to the service layer and creating their related React Query hooks.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture Principles](#architecture-principles)
- [Step-by-Step Workflow](#step-by-step-workflow)
- [Complete Example](#complete-example)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The service layer follows a **three-layer hook architecture**:

1. **Data Layer** - Pure React Query hooks for API operations
2. **Business Logic Layer** - Orchestrated hooks that combine multiple operations
3. **UI Layer** - Components that consume business logic hooks

## 🏗️ Architecture Principles

### 1. **Consistent Patterns**

- All services follow the same structure and naming conventions
- Query keys use hierarchical structure for cache management
- Error handling is centralized through `useAuth` context
- Loading states are granular for each operation

### 2. **Type Safety**

- Full TypeScript coverage for all API operations
- Request/Response types are strictly defined
- Service methods are type-safe
- Hook parameters have strict typing

### 3. **Cache Management**

- Automatic cache invalidation on mutations
- Optimistic updates where appropriate
- Query key hierarchy for efficient cache management

## 🚀 Step-by-Step Workflow

### **Step 1: Define API Endpoints**

**File: `lib/config/api-endpoints.ts`**

```typescript
export const API_ENDPOINTS = {
  // ... existing endpoints ...

  // Your new service endpoints
  YOUR_SERVICE: {
    LIST: '/api/your-service/items',
    DETAIL: (id: string) => `/api/your-service/items/${id}`,
    CREATE: '/api/your-service/items',
    UPDATE: (id: string) => `/api/your-service/items/${id}`,
    DELETE: (id: string) => `/api/your-service/items/${id}`,
  },
} as const
```

### **Step 2: Create TypeScript Types**

**File: `lib/types/your-service.types.ts`**

```typescript
/**
 * Your Service API Types
 */

// Request types
export interface CreateYourItemRequest {
  name: string
  description?: string
  // ... other fields
}

export interface UpdateYourItemRequest {
  name?: string
  description?: string
  // ... other fields
}

export interface YourItemQueryParams {
  page?: number
  limit?: number
  search?: string
  // ... other query params
}

// Response types
export interface YourItem {
  id: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
  // ... other fields
}

export interface YourItemListResponse {
  items: YourItem[]
  total: number
  page: number
  limit: number
  hasNext: boolean
  hasPrev: boolean
}

export interface YourItemResponse {
  item: YourItem
}
```

### **Step 3: Create Service Class**

**File: `lib/services/your-service/your-service.ts`**

```typescript
/**
 * Your Service for managing your items
 * Uses shared API client with auth interceptors
 */

import { API_ENDPOINTS } from '../../config/api-endpoints'
import {
  CreateYourItemRequest,
  UpdateYourItemRequest,
  YourItem,
  YourItemListResponse,
  YourItemQueryParams,
  YourItemResponse,
} from '../../types/your-service.types'
import { sharedApiClient } from '../base/api-client'

// Re-export types for convenience
export type {
  CreateYourItemRequest,
  UpdateYourItemRequest,
  YourItem,
  YourItemListResponse,
  YourItemQueryParams,
  YourItemResponse,
}

/**
 * Your Service for managing your items
 * Uses shared API client with auth interceptors
 */
export class YourService {
  /**
   * Get list of items with pagination and filtering
   */
  async getItems(params?: YourItemQueryParams): Promise<YourItemListResponse> {
    const queryParams = new URLSearchParams()

    if (params?.page) queryParams.set('page', params.page.toString())
    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.search) queryParams.set('search', params.search)

    const url = `${API_ENDPOINTS.YOUR_SERVICE.LIST}?${queryParams.toString()}`
    const response = await sharedApiClient.get<YourItemListResponse>(url)
    return response
  }

  /**
   * Get single item by ID
   */
  async getItem(id: string): Promise<YourItemResponse> {
    const response = await sharedApiClient.get<YourItemResponse>(
      API_ENDPOINTS.YOUR_SERVICE.DETAIL(id),
    )
    return response
  }

  /**
   * Create new item
   */
  async createItem(data: CreateYourItemRequest): Promise<YourItemResponse> {
    const response = await sharedApiClient.post<YourItemResponse>(
      API_ENDPOINTS.YOUR_SERVICE.CREATE,
      data,
    )
    return response
  }

  /**
   * Update existing item
   */
  async updateItem(
    id: string,
    data: UpdateYourItemRequest,
  ): Promise<YourItemResponse> {
    const response = await sharedApiClient.put<YourItemResponse>(
      API_ENDPOINTS.YOUR_SERVICE.UPDATE(id),
      data,
    )
    return response
  }

  /**
   * Delete item
   */
  async deleteItem(id: string): Promise<void> {
    await sharedApiClient.delete(API_ENDPOINTS.YOUR_SERVICE.DELETE(id))
  }
}

// Export singleton instance
export const yourService = new YourService()
```

### **Step 4: Create Service Index File**

**File: `lib/services/your-service/index.ts`**

```typescript
/**
 * Your Service module exports
 */

export { YourService, yourService } from './your-service'
export type {
  CreateYourItemRequest,
  UpdateYourItemRequest,
  YourItem,
  YourItemListResponse,
  YourItemQueryParams,
  YourItemResponse,
} from './your-service'
```

### **Step 5: Create React Query Hooks**

**File: `lib/services/hooks/your-service-hooks.ts`**

```typescript
/**
 * Your Service hooks following the three-layer hook architecture
 * 1. Data Layer - React Query hooks for API operations
 * 2. Business Logic Layer - Custom hooks that orchestrate operations
 * 3. UI Layer - Components that consume business logic hooks
 */
'use client'

import { useAuth } from '@/lib/providers/StoreProvider'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { ApiError } from 'next/dist/server/api-utils'
import { useMemo } from 'react'
import {
  CreateYourItemRequest,
  UpdateYourItemRequest,
  YourItemQueryParams,
} from '../../types/your-service.types'
import { yourService } from '../your-service/your-service'

// Query keys for React Query
export const yourServiceKeys = {
  all: ['yourService'] as const,
  lists: () => [...yourServiceKeys.all, 'list'] as const,
  list: (params: YourItemQueryParams) =>
    [...yourServiceKeys.lists(), params] as const,
  details: () => [...yourServiceKeys.all, 'detail'] as const,
  detail: (id: string) => [...yourServiceKeys.details(), id] as const,
}

// ============================================================================
// 1. DATA LAYER - React Query Hooks
// ============================================================================

/**
 * Get paginated items query hook
 * Provides basic query functionality with React Query
 */
export function useYourItems(params?: YourItemQueryParams) {
  const { setError } = useAuth()

  const query = useQuery({
    queryKey: yourServiceKeys.list(params || {}),
    queryFn: () => yourService.getItems(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })

  // Handle errors
  if (query.error) {
    setError((query.error as Error).message)
  }

  return {
    items: query.data?.items || [],
    total: query.data?.total || 0,
    page: query.data?.page || 1,
    limit: query.data?.limit || 10,
    hasNext: query.data?.hasNext || false,
    hasPrev: query.data?.hasPrev || false,
    isLoading: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Get single item query hook
 */
export function useYourItem(id: string) {
  const { setError } = useAuth()

  const query = useQuery({
    queryKey: yourServiceKeys.detail(id),
    queryFn: () => yourService.getItem(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  })

  // Handle errors
  if (query.error) {
    setError((query.error as Error).message)
  }

  return {
    item: query.data?.item,
    isLoading: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  }
}

/**
 * Create item mutation hook
 */
export function useCreateYourItem() {
  const { setError } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: CreateYourItemRequest) => {
      setError(null) // Clear errors before starting
      return yourService.createItem(data)
    },
    onSuccess: response => {
      // Invalidate and refetch items list
      queryClient.invalidateQueries({ queryKey: yourServiceKeys.lists() })
      console.log('Item created successfully:', response)
    },
    onError: (error: Error) => {
      setError(error.message)
      console.error('Failed to create item:', error.message)
    },
  })

  return {
    createItem: mutation.mutate,
    createItemAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Update item mutation hook
 */
export function useUpdateYourItem() {
  const { setError } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateYourItemRequest }) => {
      setError(null)
      return yourService.updateItem(id, data)
    },
    onSuccess: (response, variables) => {
      // Update the specific item in cache
      queryClient.setQueryData(yourServiceKeys.detail(variables.id), response)
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: yourServiceKeys.lists() })
      console.log('Item updated successfully:', response)
    },
    onError: (error: Error) => {
      setError(error.message)
      console.error('Failed to update item:', error.message)
    },
  })

  return {
    updateItem: mutation.mutate,
    updateItemAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}

/**
 * Delete item mutation hook
 */
export function useDeleteYourItem() {
  const { setError } = useAuth()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (id: string) => {
      setError(null)
      return yourService.deleteItem(id)
    },
    onSuccess: (_, id) => {
      // Remove the item from cache
      queryClient.removeQueries({ queryKey: yourServiceKeys.detail(id) })
      // Invalidate lists to ensure consistency
      queryClient.invalidateQueries({ queryKey: yourServiceKeys.lists() })
      console.log('Item deleted successfully:', id)
    },
    onError: (error: Error) => {
      setError(error.message)
      console.error('Failed to delete item:', error.message)
    },
  })

  return {
    deleteItem: mutation.mutate,
    deleteItemAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  }
}

// ============================================================================
// 2. BUSINESS LOGIC LAYER - Custom Hooks
// ============================================================================

/**
 * Comprehensive items management hook
 * Combines multiple operations for complex UI scenarios
 */
export function useYourItemsManagement() {
  const {
    items,
    total,
    page,
    limit,
    hasNext,
    hasPrev,
    isLoading: isLoadingItems,
    error: itemsError,
    refetch: refetchItems,
  } = useYourItems()

  const {
    createItem,
    createItemAsync,
    isLoading: isCreating,
    error: createError,
    reset: resetCreate,
  } = useCreateYourItem()

  const {
    updateItem,
    updateItemAsync,
    isLoading: isUpdating,
    error: updateError,
    reset: resetUpdate,
  } = useUpdateYourItem()

  const {
    deleteItem,
    deleteItemAsync,
    isLoading: isDeleting,
    error: deleteError,
    reset: resetDelete,
  } = useDeleteYourItem()

  // Computed values
  const isLoading = isLoadingItems || isCreating || isUpdating || isDeleting
  const hasError = !!(itemsError || createError || updateError || deleteError)

  // Combined error handling
  const error = itemsError || createError || updateError || deleteError

  // Business logic methods
  const handleCreateItem = async (data: CreateYourItemRequest) => {
    try {
      const result = await createItemAsync(data)
      return result
    } catch (error) {
      console.error('Failed to create item:', error)
      throw error
    }
  }

  const handleUpdateItem = async (id: string, data: UpdateYourItemRequest) => {
    try {
      const result = await updateItemAsync({ id, data })
      return result
    } catch (error) {
      console.error('Failed to update item:', error)
      throw error
    }
  }

  const handleDeleteItem = async (id: string) => {
    try {
      await deleteItemAsync(id)
    } catch (error) {
      console.error('Failed to delete item:', error)
      throw error
    }
  }

  return {
    // Data
    items,
    total,
    page,
    limit,
    hasNext,
    hasPrev,

    // Loading states
    isLoading,
    isLoadingItems,
    isCreating,
    isUpdating,
    isDeleting,

    // Error states
    hasError,
    error,
    itemsError,
    createError,
    updateError,
    deleteError,

    // Actions
    refetchItems,
    handleCreateItem,
    handleUpdateItem,
    handleDeleteItem,

    // Reset functions
    resetCreate,
    resetUpdate,
    resetDelete,
  }
}
```

### **Step 6: Update Main Service Index**

**File: `lib/services/index.ts`**

```typescript
/**
 * Service layer exports
 */

// Base types and utilities
export * from './base/types'

// Your new service
export { yourService } from './your-service'
export type {
  CreateYourItemRequest,
  UpdateYourItemRequest,
  YourItem,
  YourItemListResponse,
  YourItemQueryParams,
  YourItemResponse,
} from './your-service'

// Existing services
export { checkoutService } from './checkout/checkout-service'
```

### **Step 7: Update Main Hooks Index**

**File: `lib/services/hooks/index.ts`**

```typescript
/**
 * Service hooks exports
 */

// Your new service hooks
export {
  useYourItems,
  useYourItem,
  useCreateYourItem,
  useUpdateYourItem,
  useDeleteYourItem,
  useYourItemsManagement,
  yourServiceKeys,
} from './your-service-hooks'

// Existing hooks
export * from './auth-hooks'
export * from './renter-hooks'
export * from './booking-hooks'
export * from './checkout-hooks'
export * from './vehicle-hooks'
export * from './chat-hooks'
export * from './upload-hooks'
```

## 📝 Complete Example

### **Component Usage**

```typescript
'use client'

import { useYourItemsManagement } from '@/lib/services/hooks/your-service-hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export function YourItemsList() {
  const {
    items,
    isLoading,
    hasError,
    error,
    handleCreateItem,
    handleUpdateItem,
    handleDeleteItem,
  } = useYourItemsManagement()

  const [newItemName, setNewItemName] = useState('')
  const [newItemDescription, setNewItemDescription] = useState('')

  const handleCreate = async () => {
    if (!newItemName.trim()) return

    try {
      await handleCreateItem({
        name: newItemName,
        description: newItemDescription,
      })
      setNewItemName('')
      setNewItemDescription('')
    } catch (error) {
      console.error('Failed to create item:', error)
    }
  }

  const handleUpdate = async (id: string, name: string) => {
    try {
      await handleUpdateItem(id, { name })
    } catch (error) {
      console.error('Failed to update item:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      await handleDeleteItem(id)
    } catch (error) {
      console.error('Failed to delete item:', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (hasError) {
    return <div>Error: {error?.message}</div>
  }

  return (
    <div className="space-y-4">
      {/* Create Form */}
      <Card>
        <CardHeader>
          <CardTitle>Create New Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Item name"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <Input
            placeholder="Item description"
            value={newItemDescription}
            onChange={(e) => setNewItemDescription(e.target.value)}
          />
          <Button onClick={handleCreate}>Create Item</Button>
        </CardContent>
      </Card>

      {/* Items List */}
      <div className="space-y-2">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{item.description}</p>
              <div className="flex space-x-2 mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleUpdate(item.id, item.name + ' (Updated)')}
                >
                  Update
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(item.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

## ✅ Best Practices

### **1. Naming Conventions**

- Service classes: `YourService` (PascalCase)
- Service instances: `yourService` (camelCase)
- Hook functions: `useYourItems` (camelCase with `use` prefix)
- Query keys: `yourServiceKeys` (camelCase with `Keys` suffix)

### **2. Error Handling**

- Always use `setError(null)` before mutations
- Provide granular error states for different operations
- Include reset functions for error recovery

### **3. Cache Management**

- Use hierarchical query keys for efficient cache management
- Invalidate related queries on mutations
- Use `setQueryData` for optimistic updates

### **4. Loading States**

- Provide granular loading states for each operation
- Combine loading states in business logic hooks
- Use `isFetching` instead of `isLoading` for queries

### **5. Type Safety**

- Define strict TypeScript interfaces for all API operations
- Use generic types for service methods
- Ensure hook parameters are properly typed

## 🔧 Troubleshooting

### **Common Issues**

1. **Cache Key Mismatch**

   ```typescript
   // ❌ Wrong - different key structure
   queryClient.getQueryData(['yourService', 'detail', id])

   // ✅ Correct - matches query key
   queryClient.getQueryData(yourServiceKeys.detail(id))
   ```

2. **Error Handling**

   ```typescript
   // ❌ Wrong - not clearing errors
   const mutation = useMutation({
     mutationFn: yourService.createItem,
   })

   // ✅ Correct - clearing errors
   const mutation = useMutation({
     mutationFn: data => {
       setError(null) // Clear errors
       return yourService.createItem(data)
     },
   })
   ```

3. **Query Invalidation**

   ```typescript
   // ❌ Wrong - too broad invalidation
   queryClient.invalidateQueries({ queryKey: ['yourService'] })

   // ✅ Correct - specific invalidation
   queryClient.invalidateQueries({ queryKey: yourServiceKeys.lists() })
   ```

### **Debug Tips**

1. **Enable React Query DevTools**

   ```typescript
   import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

   function App() {
     return (
       <>
         <YourComponent />
         <ReactQueryDevtools initialIsOpen={false} />
       </>
     )
   }
   ```

2. **Add Debug Logging**

   ```typescript
   const query = useQuery({
     queryKey: yourServiceKeys.list(params),
     queryFn: () => {
       console.log('Fetching items with params:', params)
       return yourService.getItems(params)
     },
   })
   ```

3. **Check Network Tab**
   - Verify API calls are being made
   - Check request/response payloads
   - Ensure proper headers are being sent

## �� Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

This workflow ensures consistency with the existing codebase while providing a robust, type-safe, and maintainable service layer! 🚀
