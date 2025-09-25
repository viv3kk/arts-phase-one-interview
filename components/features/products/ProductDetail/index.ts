/**
 * Barrel exports for Product Detail components
 */

// Main components
export { ProductDetailClient } from './ProductDetailClient'
export { ProductDetailLayout } from './ProductDetailLayout'
export { ProductDetailHeader } from './ProductDetailHeader'
export { ProductDetailContent } from './ProductDetailContent'
export { ProductDetailSkeleton } from './ProductDetailSkeleton'
export { ProductNotFound } from './ProductNotFound'

// Sub-components
export * from './ProductImages'
export * from './ProductInformation'
export * from './ProductReviews'

// Context and hooks
export { ProductDetailUIProvider } from './context/ProductDetailUIProvider'
export { useProductDetailUI } from './hooks/useProductDetailUI'
