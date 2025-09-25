/**
 * Cart Page
 * Displays shopping cart with items, quantities, and totals
 */

import { CartClient } from '@/components/features/cart/CartClient'
// Unused imports removed

export default function CartPage() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-foreground mb-2'>
          Shopping Cart
        </h1>
        <p className='text-muted-foreground'>
          Review your items and proceed to checkout
        </p>
      </div>

      <CartClient />
    </div>
  )
}

export const metadata = {
  title: 'Shopping Cart | Store',
  description: 'Review your cart items and proceed to checkout.',
}
