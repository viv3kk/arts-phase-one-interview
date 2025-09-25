/**
 * Products API Types
 * Based on DummyJSON API documentation
 */

// Request types
export interface ProductQueryParams {
  page?: number
  limit?: number
  skip?: number
  search?: string
  category?: string
  sortBy?: string
  order?: 'asc' | 'desc'
  select?: string
}

export interface ProductSearchParams {
  q: string
  limit?: number
  skip?: number
  select?: string
}

export interface CreateProductRequest {
  title: string
  description: string
  price: number
  discountPercentage?: number
  rating?: number
  stock?: number
  brand?: string
  category: string
  thumbnail?: string
  images?: string[]
}

export interface UpdateProductRequest {
  title?: string
  description?: string
  price?: number
  discountPercentage?: number
  rating?: number
  stock?: number
  brand?: string
  category?: string
  thumbnail?: string
  images?: string[]
}

// Response types
export interface Product {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
  tags?: string[]
  sku?: string
  weight?: number
  dimensions?: {
    width: number
    height: number
    depth: number
  }
  warrantyInformation?: string
  shippingInformation?: string
  availabilityStatus?: string
  reviews?: ProductReview[]
  returnPolicy?: string
  minimumOrderQuantity?: number
  meta?: {
    createdAt: string
    updatedAt: string
    barcode?: string
    qrCode?: string
  }
}

export interface ProductReview {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface ProductListResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export interface ProductResponse {
  id: number
  title: string
  description: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  brand: string
  category: string
  thumbnail: string
  images: string[]
  tags?: string[]
  sku?: string
  weight?: number
  dimensions?: {
    width: number
    height: number
    depth: number
  }
  warrantyInformation?: string
  shippingInformation?: string
  availabilityStatus?: string
  reviews?: ProductReview[]
  returnPolicy?: string
  minimumOrderQuantity?: number
  meta?: {
    createdAt: string
    updatedAt: string
    barcode?: string
    qrCode?: string
  }
}

export interface ProductCategory {
  slug: string
  name: string
  url: string
}

export type ProductCategoriesResponse = ProductCategory[]

export type ProductCategoryListResponse = string[]

export interface ProductByCategoryResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

// Search response
export interface ProductSearchResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

// Delete response
export interface ProductDeleteResponse extends Product {
  isDeleted: boolean
  deletedOn: string
}
