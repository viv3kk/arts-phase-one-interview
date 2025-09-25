/**
 * Product Detail Client Component
 * Displays detailed product information with image gallery and reviews
 */

'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useProduct } from '@/lib/services/hooks'
import { useCart } from '@/lib/providers/StoreProvider'
import { Star, Heart, Share2, ShoppingCart, ArrowLeft, Check, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'

// Client-side only date formatting to avoid hydration issues
const ClientDate = ({ dateString }: { dateString: string }) => {
  const [formattedDate, setFormattedDate] = useState<string>('')
  
  useEffect(() => {
    const date = new Date(dateString)
    setFormattedDate(date.toLocaleDateString())
  }, [dateString])
  
  return <span>{formattedDate}</span>
}

interface ProductDetailClientProps {
  productId: number
}

export function ProductDetailClient({ productId }: ProductDetailClientProps) {
  const { product, isLoading, error } = useProduct(productId)
  const { addItem, items } = useCart()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [addToCartState, setAddToCartState] = useState<'idle' | 'adding' | 'success' | 'error'>('idle')

  if (isLoading) {
    return <ProductDetailSkeleton />
  }

  if (error || !product) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-destructive mb-2">
              Product Not Found
            </h3>
            <p className="text-muted-foreground mb-4">
              The requested product could not be found.
            </p>
            <Button asChild>
              <Link href="/products">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  const discountPrice = product.price - (product.price * product.discountPercentage / 100)
  const isOnSale = product.discountPercentage > 0

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return

    console.log('🛒 handleAddToCart called:', { product: product.title, quantity })
    
    try {
      setIsAddingToCart(true)
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
        setIsAddingToCart(false)
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
        setIsAddingToCart(false)
      }, 3000)
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" asChild>
        <Link href="/products">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              src={product.images[selectedImage] || product.thumbnail}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
            {isOnSale && (
              <Badge 
                variant="destructive" 
                className="absolute top-4 left-4"
              >
                -{product.discountPercentage}% OFF
              </Badge>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.slice(0, 4).map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square relative overflow-hidden rounded-md border-2 transition-colors ${
                    selectedImage === index 
                      ? 'border-primary' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Title and Brand */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">{product.brand}</Badge>
              <Badge variant="outline">{product.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {product.title}
            </h1>
            <p className="text-muted-foreground text-lg">
              {product.description}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviews?.length || 0} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-foreground">
                ${discountPrice.toFixed(2)}
              </span>
              {isOnSale && (
                <span className="text-xl text-muted-foreground line-through">
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            {isOnSale && (
              <p className="text-sm text-green-600 font-medium">
                You save ${(product.price - discountPrice).toFixed(2)}!
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Stock:</span>
            <Badge 
              variant={product.stock > 10 ? "default" : product.stock > 0 ? "secondary" : "destructive"}
            >
              {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </Badge>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label htmlFor="quantity" className="text-sm font-medium">
                  Quantity:
                </label>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log('🛒 Decreasing quantity:', quantity - 1)
                      setQuantity(Math.max(1, quantity - 1))
                    }}
                    disabled={quantity <= 1}
                  >
                    -
                  </Button>
                  <span className="px-3 py-1 min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
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

            <div className="flex gap-3">
              <Button 
                size="lg" 
                className="flex-1 transition-all duration-200"
                disabled={product.stock === 0 || isAddingToCart}
                onClick={handleAddToCart}
                variant={addToCartState === 'success' ? 'default' : addToCartState === 'error' ? 'destructive' : 'default'}
              >
                {addToCartState === 'adding' && (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Adding...
                  </>
                )}
                {addToCartState === 'success' && (
                  <>
                    <Check className="h-5 w-5 mr-2" />
                    Added to Cart!
                  </>
                )}
                {addToCartState === 'error' && (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Try Again
                  </>
                )}
                {addToCartState === 'idle' && (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button variant="outline" size="lg">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Product Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Product Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">SKU:</span>
                <span className="ml-2 font-medium">{product.sku || 'N/A'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Weight:</span>
                <span className="ml-2 font-medium">{product.weight || 'N/A'} kg</span>
              </div>
              {product.dimensions && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Dimensions:</span>
                  <span className="ml-2 font-medium">
                    {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} cm
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Warranty and Shipping */}
          {(product.warrantyInformation || product.shippingInformation) && (
            <>
              <Separator />
              <div className="space-y-2">
                {product.warrantyInformation && (
                  <div>
                    <span className="text-sm font-medium">Warranty:</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {product.warrantyInformation}
                    </span>
                  </div>
                )}
                {product.shippingInformation && (
                  <div>
                    <span className="text-sm font-medium">Shipping:</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {product.shippingInformation}
                    </span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      {product.reviews && product.reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {product.reviews.map((review, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{review.reviewerName}</span>
                    <span className="text-sm text-muted-foreground">
                      <ClientDate dateString={review.date} />
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Loading Skeleton Component
function ProductDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-32" />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Skeleton */}
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full" />
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square" />
            ))}
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-20" />
            </div>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>

          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>

          <Skeleton className="h-4 w-20" />

          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-12" />
              <Skeleton className="h-12 w-12" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
