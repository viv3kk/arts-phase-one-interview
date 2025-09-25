/**
 * Cart Client Component
 * Displays cart items with quantity controls and totals
 */

'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useCart } from '@/lib/providers/StoreProvider'
import { CartItem } from '@/lib/stores/slices/cart.slice'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import {
  formatPrice,
  validatePricingCalculations,
  calculateDiscountedPrice,
  calculateItemTotal,
} from '@/lib/utils/pricing'

export function CartClient() {
  const {
    items,
    totalItems,
    itemCount,
    isEmpty,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart()

  // Calculate pricing using utility functions
  const pricingCalculations = useMemo(() => {
    const validation = validatePricingCalculations(items)

    // Log validation results for debugging
    console.log('🧮 Pricing Validation:', {
      isValid: validation.isValid,
      subtotal: validation.formattedSubtotal,
      savings: validation.formattedSavings,
      total: validation.formattedTotal,
      itemCount: items.length,
      totalItems: totalItems,
    })

    return validation
  }, [items, totalItems])

  // Extract calculated values
  const { subtotal, totalSavings, finalTotal, isValid } = pricingCalculations

  if (isEmpty) {
    return (
      <Card>
        <CardContent className='p-8'>
          <div className='text-center'>
            <ShoppingBag className='h-16 w-16 text-muted-foreground mx-auto mb-4' />
            <h3 className='text-xl font-semibold mb-2'>Your cart is empty</h3>
            <p className='text-muted-foreground mb-6'>
              Add some products to get started
            </p>
            <Button asChild>
              <Link href='/products'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
      {/* Cart Items */}
      <div className='lg:col-span-2 space-y-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold'>Cart Items ({itemCount})</h2>
          <Button
            variant='outline'
            size='sm'
            onClick={clearCart}
            className='text-destructive hover:text-destructive'
          >
            <Trash2 className='h-4 w-4 mr-2' />
            Clear Cart
          </Button>
        </div>

        <div className='space-y-4'>
          {items.map(item => (
            <CartItemCard
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>
      </div>

      {/* Cart Summary */}
      <div className='lg:col-span-1'>
        <Card className='sticky top-4'>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {/* Validation Warning */}
            {!isValid && (
              <div className='bg-yellow-50 border border-yellow-200 rounded-md p-3'>
                <p className='text-sm text-yellow-800'>
                  ⚠️ Pricing calculation mismatch detected. Please refresh the
                  page.
                </p>
              </div>
            )}

            {/* Item Count - Show original subtotal before discounts */}
            <div className='flex justify-between text-sm'>
              <span>Items ({totalItems})</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {/* Discount */}
            {totalSavings > 0 && (
              <div className='flex justify-between text-sm text-green-600'>
                <span>Discount</span>
                <span>-{formatPrice(totalSavings)}</span>
              </div>
            )}

            {/* Shipping */}
            <div className='flex justify-between text-sm'>
              <span>Shipping</span>
              <span className='text-green-600'>Free</span>
            </div>

            <Separator />

            {/* Total - Final amount after applying discounts */}
            <div className='flex justify-between text-lg font-semibold'>
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>

            {/* Checkout Button */}
            <Button size='lg' className='w-full'>
              Proceed to Checkout
            </Button>

            {/* Continue Shopping */}
            <Button variant='outline' size='lg' className='w-full' asChild>
              <Link href='/products'>
                <ArrowLeft className='h-4 w-4 mr-2' />
                Continue Shopping
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Cart Item Card Component
interface CartItemCardProps {
  item: CartItem
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => void
}

function CartItemCard({ item, onUpdateQuantity, onRemove }: CartItemCardProps) {
  // Use utility function for discounted price calculation
  const discountPrice = item.discountPercentage
    ? calculateDiscountedPrice(item.price, item.discountPercentage)
    : item.price

  // Calculate item total using utility function
  const itemTotal = calculateItemTotal(
    item.price,
    item.quantity,
    item.discountPercentage,
  )

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemove(item.id)
    } else {
      onUpdateQuantity(item.id, newQuantity)
    }
  }

  return (
    <Card>
      <CardContent className='p-4'>
        <div className='flex gap-4'>
          {/* Product Image */}
          <div className='relative w-20 h-20 flex-shrink-0'>
            <Image
              src={item.thumbnail}
              alt={item.title}
              fill
              className='object-cover rounded-md'
            />
            {item.discountPercentage && item.discountPercentage > 0 && (
              <Badge
                variant='destructive'
                className='absolute -top-1 -right-1 text-xs'
              >
                -{item.discountPercentage}%
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className='flex-1 min-w-0'>
            <div className='flex items-start justify-between'>
              <div className='flex-1 min-w-0'>
                <h3 className='font-semibold text-lg truncate'>{item.title}</h3>
                {item.brand && (
                  <p className='text-sm text-muted-foreground'>{item.brand}</p>
                )}
                {item.category && (
                  <Badge variant='outline' className='text-xs mt-1'>
                    {item.category}
                  </Badge>
                )}
              </div>

              {/* Remove Button */}
              <Button
                variant='ghost'
                size='sm'
                onClick={() => onRemove(item.id)}
                className='text-destructive hover:text-destructive'
              >
                <Trash2 className='h-4 w-4' />
              </Button>
            </div>

            {/* Price and Quantity Controls */}
            <div className='flex items-center justify-between mt-4'>
              {/* Price */}
              <div className='flex items-center gap-2'>
                <span className='text-lg font-bold'>
                  {formatPrice(discountPrice)}
                </span>
                {item.discountPercentage && item.discountPercentage > 0 && (
                  <span className='text-sm text-muted-foreground line-through'>
                    {formatPrice(item.price)}
                  </span>
                )}
              </div>

              {/* Quantity Controls */}
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className='h-4 w-4' />
                </Button>

                <span className='w-8 text-center font-medium'>
                  {item.quantity}
                </span>

                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
            </div>

            {/* Item Total */}
            <div className='flex justify-end mt-2'>
              <span className='text-sm text-muted-foreground'>
                Total: {formatPrice(itemTotal)}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Loading Skeleton Component
export function CartSkeleton() {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
      <div className='lg:col-span-2 space-y-4'>
        <Skeleton className='h-8 w-48' />
        <div className='space-y-4'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className='p-4'>
                <div className='flex gap-4'>
                  <Skeleton className='w-20 h-20' />
                  <div className='flex-1 space-y-2'>
                    <Skeleton className='h-6 w-3/4' />
                    <Skeleton className='h-4 w-1/2' />
                    <div className='flex justify-between'>
                      <Skeleton className='h-6 w-20' />
                      <Skeleton className='h-8 w-24' />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className='lg:col-span-1'>
        <Card>
          <CardHeader>
            <Skeleton className='h-6 w-32' />
          </CardHeader>
          <CardContent className='space-y-4'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-12 w-full' />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
