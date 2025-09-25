/**
 * Product Detail UI Hook
 * Hook to access Product Detail UI state from context
 */

import { useContext } from 'react'
import { ProductDetailUIContext } from '../context/ProductDetailUIProvider'

/**
 * Hook to use Product Detail UI state
 * Must be used within ProductDetailUIProvider
 */
export function useProductDetailUI() {
  const context = useContext(ProductDetailUIContext)
  if (!context) {
    throw new Error(
      'useProductDetailUI must be used within ProductDetailUIProvider',
    )
  }
  return context
}
