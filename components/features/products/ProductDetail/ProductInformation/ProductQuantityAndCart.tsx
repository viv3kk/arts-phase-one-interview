/**
 * Product Quantity and Cart Component
 * Handles quantity selection and add to cart functionality
 */

import { Button } from '@/components/ui/button'
import { Heart, Share2, ShoppingCart, Check, Loader2, Eye } from 'lucide-react'
import { useProductDetailUI } from '../hooks/useProductDetailUI'
import { useCart } from '@/lib/providers/StoreProvider'
import { useRouter } from 'next/navigation'

export function ProductQuantityAndCart() {
  const { product, quantity, setQuantity, handleAddToCart, addToCartState } =
    useProductDetailUI()
  const { items, totalItems } = useCart()
  const router = useRouter()

  if (!product) return null

  // Check if product is already in cart
  const existingCartItem = items.find(item => item.id === product.id)
  const isInCart = !!existingCartItem
  const cartQuantity = existingCartItem?.quantity || 0

  // Check if adding more would exceed stock
  const wouldExceedStock = quantity + cartQuantity > product.stock
  const maxAllowedQuantity = Math.max(0, product.stock - cartQuantity)

  // Handle quantity change with stock validation
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) return
    if (isInCart && newQuantity + cartQuantity > product.stock) {
      // Show warning toast
      console.warn('⚠️ Cannot add more items - would exceed stock limit')
      return
    }
    setQuantity(newQuantity)
  }

  // Navigate to cart
  const handleViewCart = () => {
    router.push('/cart')
  }

  return (
    <div className='space-y-4'>
      {/* Stock warning */}
      {wouldExceedStock && (
        <div className='bg-yellow-50 border border-yellow-200 rounded-md p-3'>
          <p className='text-sm text-yellow-800'>
            ⚠️ Cannot add more items. You already have {cartQuantity} in cart.
            Maximum allowed: {maxAllowedQuantity} more.
          </p>
        </div>
      )}

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <label htmlFor='quantity' className='text-sm font-medium'>
            Quantity:
          </label>
          <div className='flex items-center border rounded-md'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                console.log('🛒 Decreasing quantity:', quantity - 1)
                handleQuantityChange(Math.max(1, quantity - 1))
              }}
              disabled={quantity <= 1}
            >
              -
            </Button>
            <span className='px-3 py-1 min-w-[3rem] text-center'>
              {quantity}
            </span>
            <Button
              variant='outline'
              size='sm'
              onClick={() => {
                console.log('🛒 Increasing quantity:', quantity + 1)
                handleQuantityChange(quantity + 1)
              }}
              disabled={quantity >= maxAllowedQuantity || wouldExceedStock}
            >
              +
            </Button>
          </div>
        </div>
      </div>

      <div className='flex gap-3'>
        <Button
          size='lg'
          className='flex-1 transition-all duration-200'
          disabled={
            product.stock === 0 ||
            addToCartState === 'adding' ||
            wouldExceedStock
          }
          onClick={handleAddToCart}
          variant={
            addToCartState === 'success'
              ? 'default'
              : addToCartState === 'error'
                ? 'destructive'
                : 'default'
          }
        >
          {addToCartState === 'adding' && (
            <>
              <Loader2 className='h-5 w-5 mr-2 animate-spin' />
              Adding...
            </>
          )}
          {addToCartState === 'success' && (
            <>
              <Check className='h-5 w-5 mr-2' />
              {isInCart ? 'Added More!' : 'Added to Cart!'}
            </>
          )}
          {addToCartState === 'error' && (
            <>
              <ShoppingCart className='h-5 w-5 mr-2' />
              Try Again
            </>
          )}
          {addToCartState === 'idle' && (
            <>
              <ShoppingCart className='h-5 w-5 mr-2' />
              {isInCart ? 'Add More' : 'Add to Cart'}
            </>
          )}
        </Button>

        {/* View Cart CTA - only show if there are items in cart */}
        {totalItems > 0 && (
          <Button
            variant='outline'
            size='lg'
            onClick={handleViewCart}
            className='flex items-center gap-2'
          >
            <Eye className='h-5 w-5' />
            <span className='hidden sm:inline'>View Cart</span>
            <span className='bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs font-bold min-w-[1.5rem] h-6 flex items-center justify-center'>
              {totalItems}
            </span>
          </Button>
        )}

        <Button variant='outline' size='lg'>
          <Heart className='h-5 w-5' />
        </Button>
        <Button variant='outline' size='lg'>
          <Share2 className='h-5 w-5' />
        </Button>
      </div>
    </div>
  )
}
