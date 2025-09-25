/**
 * Product Quantity and Cart Component
 * Handles quantity selection and add to cart functionality
 */

import { Button } from '@/components/ui/button'
import { Heart, Share2, ShoppingCart, Check, Loader2 } from 'lucide-react'
import { useProductDetailUI } from '../hooks/useProductDetailUI'

export function ProductQuantityAndCart() {
  const { product, quantity, setQuantity, handleAddToCart, addToCartState } =
    useProductDetailUI()

  if (!product) return null

  return (
    <div className='space-y-4'>
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
                setQuantity(Math.max(1, quantity - 1))
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
                setQuantity(quantity + 1)
              }}
              disabled={quantity >= product.stock}
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
          disabled={product.stock === 0 || addToCartState === 'adding'}
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
              Added to Cart!
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
              Add to Cart
            </>
          )}
        </Button>
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
