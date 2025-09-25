/**
 * Product Detail UI Provider Component
 * Provides UI state context for product detail components
 */

'use client'

import React, { createContext, useState, useCallback } from 'react'
import { useCart } from '@/lib/providers/StoreProvider'
import { toast } from 'sonner'
import type { Product } from '@/lib/types/products.types'

// UI State Interface
export interface ProductDetailUIState {
  product: Product
  selectedImage: number
  quantity: number
  addToCartState: 'idle' | 'adding' | 'success' | 'error'
  setSelectedImage: (index: number) => void
  setQuantity: (quantity: number) => void
  handleAddToCart: () => Promise<void>
}

// Context for UI state only
export const ProductDetailUIContext =
  createContext<ProductDetailUIState | null>(null)

// Provider Props
interface ProductDetailUIProviderProps {
  product: Product
  children: React.ReactNode
}

/**
 * Provider component for Product Detail UI state
 * Manages image selection, quantity, and cart interactions
 */
export function ProductDetailUIProvider({
  product,
  children,
}: ProductDetailUIProviderProps) {
  const { addItem, items } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addToCartState, setAddToCartState] = useState<
    'idle' | 'adding' | 'success' | 'error'
  >('idle')

  const handleAddToCart = useCallback(async () => {
    if (!product || addToCartState === 'adding') return

    console.log('🛒 handleAddToCart called:', {
      product: product.title,
      quantity,
    })

    try {
      setAddToCartState('adding')

      // Check if item already exists in cart
      const existingItem = items.find(item => item.id === product.id)
      const isNewItem = !existingItem

      // Add item to cart
      addItem(product, quantity)

      // Reset quantity to 1 after successful add
      setQuantity(1)

      // Show success state
      setAddToCartState('success')

      // Enhanced toast message
      if (isNewItem) {
        toast.success(`✅ Added ${quantity}x ${product.title} to cart!`, {
          description: `Cart now has ${items.length + 1} items`,
          duration: 3000,
        })
      } else {
        toast.success(`✅ Updated ${product.title} in cart!`, {
          description: `New quantity: ${existingItem.quantity + quantity}`,
          duration: 3000,
        })
      }

      // Reset button state after 2 seconds
      setTimeout(() => {
        setAddToCartState('idle')
      }, 2000)
    } catch (error) {
      console.error('🛒 Failed to add to cart:', error)
      setAddToCartState('error')
      toast.error('❌ Failed to add to cart. Please try again.', {
        description: 'Something went wrong. Please refresh and try again.',
        duration: 4000,
      })

      // Reset error state after 3 seconds
      setTimeout(() => {
        setAddToCartState('idle')
      }, 3000)
    }
  }, [product, quantity, addItem, items, addToCartState])

  const value: ProductDetailUIState = {
    product,
    selectedImage,
    quantity,
    addToCartState,
    setSelectedImage,
    setQuantity,
    handleAddToCart,
  }

  return (
    <ProductDetailUIContext.Provider value={value}>
      {children}
    </ProductDetailUIContext.Provider>
  )
}
