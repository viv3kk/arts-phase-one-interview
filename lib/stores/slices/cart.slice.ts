/**
 * Cart slice for Zustand store
 * Follows slice-based architecture pattern for modularity
 */
'use client'

import {
  ActionCreator,
  BaseSlice,
  ComputedGetter,
} from '@/lib/types/store.types'
import { StateCreator } from 'zustand'
import { Product } from '@/lib/types/products.types'

/**
 * Cart item interface
 * Represents a product in the cart with quantity
 */
export interface CartItem {
  id: number
  title: string
  price: number
  thumbnail: string
  quantity: number
  discountPercentage?: number
  brand?: string
  category?: string
}

/**
 * Cart state interface extending base slice
 * Manages shopping cart state and operations
 */
export interface CartState extends BaseSlice {
  // Core cart state
  items: CartItem[]
  isOpen: boolean

  // Cart actions
  addItem: ActionCreator<[Product, number?]>
  removeItem: ActionCreator<[number]>
  updateQuantity: ActionCreator<[number, number]>
  clearCart: ActionCreator<[]>
  toggleCart: ActionCreator<[]>
  setCartOpen: ActionCreator<[boolean]>

  // Computed properties
  totalItems: number
  totalPrice: number
  itemCount: number
  isEmpty: boolean
}

/**
 * Initial cart state
 */
export const initialCartState: Omit<
  CartState,
  | 'addItem'
  | 'removeItem'
  | 'updateQuantity'
  | 'clearCart'
  | 'toggleCart'
  | 'setCartOpen'
  | 'setLoading'
  | 'setError'
  | 'clearError'
  | 'totalItems'
  | 'totalPrice'
  | 'itemCount'
  | 'isEmpty'
> = {
  items: [],
  isOpen: false,
  isLoading: false,
  error: null,
}

/**
 * Create cart slice
 * Implements cart state management with persistence
 */
export const createCartSlice: StateCreator<
  CartState,
  [],
  [],
  CartState
> = (set, get) => ({
  // Initialize with default state
  ...initialCartState,

  // Add item to cart
  addItem: (product: Product, quantity: number = 1) => {
    console.log('🛒 Adding item to cart:', { product: product.title, quantity })
    set((state) => {
      const existingItem = state.items.find(item => item.id === product.id)
      
      if (existingItem) {
        // Update quantity if item already exists
        console.log('🛒 Updating existing item quantity')
        return {
          items: state.items.map(item =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        }
      } else {
        // Add new item to cart
        console.log('🛒 Adding new item to cart')
        const newItem: CartItem = {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity,
          discountPercentage: product.discountPercentage,
          brand: product.brand,
          category: product.category,
        }
        
        return {
          items: [...state.items, newItem],
        }
      }
    })
  },

  // Remove item from cart
  removeItem: (id: number) => {
    set((state) => ({
      items: state.items.filter(item => item.id !== id),
    }))
  },

  // Update item quantity
  updateQuantity: (id: number, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(id)
      return
    }

    set((state) => ({
      items: state.items.map(item =>
        item.id === id ? { ...item, quantity } : item
      ),
    }))
  },

  // Clear entire cart
  clearCart: () => {
    set({
      items: [],
    })
  },

  // Toggle cart open/closed
  toggleCart: () => {
    set((state) => ({
      isOpen: !state.isOpen,
    }))
  },

  // Set cart open state
  setCartOpen: (isOpen: boolean) => {
    set({ isOpen })
  },

  // Set loading state (from BaseSlice)
  setLoading: (isLoading: boolean) =>
    set({
      isLoading,
    }),

  // Set error (from BaseSlice)
  setError: (error: string | null) =>
    set({
      error,
    }),

  // Clear error (from BaseSlice)
  clearError: () =>
    set({
      error: null,
    }),

  // Computed: Total number of items in cart
  get totalItems() {
    const state = get()
    if (!state || !state.items || !Array.isArray(state.items)) {
      return 0
    }
    const total = state.items.reduce((total, item) => total + item.quantity, 0)
    console.log('🛒 totalItems computed:', { items: state.items, total })
    return total
  },

  // Computed: Total price of all items in cart
  get totalPrice() {
    const state = get()
    if (!state || !state.items || !Array.isArray(state.items)) {
      return 0
    }
    return state.items.reduce((total, item) => {
      const itemPrice = item.discountPercentage 
        ? item.price - (item.price * item.discountPercentage / 100)
        : item.price
      return total + (itemPrice * item.quantity)
    }, 0)
  },

  // Computed: Number of unique items in cart
  get itemCount() {
    const state = get()
    if (!state || !state.items || !Array.isArray(state.items)) {
      return 0
    }
    return state.items.length
  },

  // Computed: Check if cart is empty
  get isEmpty() {
    const state = get()
    if (!state || !state.items || !Array.isArray(state.items)) {
      return true
    }
    return state.items.length === 0
  },
})
