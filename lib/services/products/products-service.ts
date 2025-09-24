/**
 * Products Service for managing products from DummyJSON API
 * Uses shared API client with auth interceptors
 */

import { API_ENDPOINTS } from '../../config/api-endpoints'
import {
  CreateProductRequest,
  Product,
  ProductByCategoryResponse,
  ProductCategoriesResponse,
  ProductCategoryListResponse,
  ProductDeleteResponse,
  ProductListResponse,
  ProductQueryParams,
  ProductResponse,
  ProductSearchParams,
  ProductSearchResponse,
  UpdateProductRequest,
} from '../../types/products.types'
import { sharedApiClient } from '../base/api-client'

// Re-export types for convenience
export type {
  CreateProductRequest,
  Product,
  ProductByCategoryResponse,
  ProductCategoriesResponse,
  ProductCategoryListResponse,
  ProductDeleteResponse,
  ProductListResponse,
  ProductQueryParams,
  ProductResponse,
  ProductSearchParams,
  ProductSearchResponse,
  UpdateProductRequest,
}

/**
 * Products Service for managing products from DummyJSON API
 * Uses shared API client with auth interceptors
 */
export class ProductsService {
  /**
   * Get list of products with pagination and filtering
   * Note: DummyJSON API uses 'limit' and 'skip' for pagination, not 'page'
   * If 'page' is provided, it will be converted to 'skip' using: skip = (page - 1) * limit
   */
  async getProducts(params?: ProductQueryParams): Promise<ProductListResponse> {
    const queryParams = new URLSearchParams()

    // Handle pagination: convert page to skip if page is provided
    if (params?.page && params?.limit) {
      const skip = (params.page - 1) * params.limit
      queryParams.set('skip', skip.toString())
    } else if (params?.skip) {
      queryParams.set('skip', params.skip.toString())
    }

    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.search) queryParams.set('search', params.search)
    if (params?.category) queryParams.set('category', params.category)
    if (params?.sortBy) queryParams.set('sortBy', params.sortBy)
    if (params?.order) queryParams.set('order', params.order)
    if (params?.select) queryParams.set('select', params.select)

    const url = `${API_ENDPOINTS.PRODUCTS.LIST}?${queryParams.toString()}`
    const response = await sharedApiClient.get<ProductListResponse>(url)
    return response
  }

  /**
   * Get single product by ID
   */
  async getProduct(id: number): Promise<ProductResponse> {
    const response = await sharedApiClient.get<ProductResponse>(
      API_ENDPOINTS.PRODUCTS.DETAIL(id),
    )
    return response
  }

  /**
   * Search products by query
   */
  async searchProducts(params: ProductSearchParams): Promise<ProductSearchResponse> {
    const queryParams = new URLSearchParams()

    queryParams.set('q', params.q)
    if (params.limit) queryParams.set('limit', params.limit.toString())
    if (params.skip) queryParams.set('skip', params.skip.toString())
    if (params.select) queryParams.set('select', params.select)

    const url = `${API_ENDPOINTS.PRODUCTS.SEARCH}?${queryParams.toString()}`
    const response = await sharedApiClient.get<ProductSearchResponse>(url)
    return response
  }

  /**
   * Get all product categories
   */
  async getCategories(): Promise<ProductCategoriesResponse> {
    const response = await sharedApiClient.get<ProductCategoriesResponse>(
      API_ENDPOINTS.PRODUCTS.CATEGORIES,
    )
    return response
  }

  /**
   * Get product category list (simple array)
   */
  async getCategoryList(): Promise<ProductCategoryListResponse> {
    const response = await sharedApiClient.get<ProductCategoryListResponse>(
      API_ENDPOINTS.PRODUCTS.CATEGORY_LIST,
    )
    return response
  }

  /**
   * Get products by category
   * Note: DummyJSON API uses 'limit' and 'skip' for pagination, not 'page'
   * If 'page' is provided, it will be converted to 'skip' using: skip = (page - 1) * limit
   */
  async getProductsByCategory(
    category: string,
    params?: Omit<ProductQueryParams, 'category'>,
  ): Promise<ProductByCategoryResponse> {
    const queryParams = new URLSearchParams()

    // Handle pagination: convert page to skip if page is provided
    if (params?.page && params?.limit) {
      const skip = (params.page - 1) * params.limit
      queryParams.set('skip', skip.toString())
    } else if (params?.skip) {
      queryParams.set('skip', params.skip.toString())
    }

    if (params?.limit) queryParams.set('limit', params.limit.toString())
    if (params?.search) queryParams.set('search', params.search)
    if (params?.sortBy) queryParams.set('sortBy', params.sortBy)
    if (params?.order) queryParams.set('order', params.order)
    if (params?.select) queryParams.set('select', params.select)

    const url = `${API_ENDPOINTS.PRODUCTS.BY_CATEGORY(category)}?${queryParams.toString()}`
    const response = await sharedApiClient.get<ProductByCategoryResponse>(url)
    return response
  }

  /**
   * Create new product
   */
  async createProduct(data: CreateProductRequest): Promise<ProductResponse> {
    const response = await sharedApiClient.post<ProductResponse>(
      API_ENDPOINTS.PRODUCTS.CREATE,
      data,
    )
    return response
  }

  /**
   * Update existing product
   */
  async updateProduct(
    id: number,
    data: UpdateProductRequest,
  ): Promise<ProductResponse> {
    const response = await sharedApiClient.put<ProductResponse>(
      API_ENDPOINTS.PRODUCTS.UPDATE(id),
      data,
    )
    return response
  }

  /**
   * Delete product
   */
  async deleteProduct(id: number): Promise<ProductDeleteResponse> {
    const response = await sharedApiClient.delete<ProductDeleteResponse>(
      API_ENDPOINTS.PRODUCTS.DELETE(id),
    )
    return response
  }
}

// Export singleton instance
export const productsService = new ProductsService()
