/**
 * Pricing utility functions
 * Handles currency formatting, discount calculations, and price computations
 */

/**
 * Format a number as currency with proper locale formatting
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a number as currency with dollar sign (simple format)
 * @param amount - The amount to format
 * @returns Formatted currency string with $ prefix
 */
export function formatPrice(amount: number): string {
  return `$${amount.toFixed(2)}`
}

/**
 * Calculate discounted price from original price and discount percentage
 * @param originalPrice - The original price
 * @param discountPercentage - The discount percentage (0-100)
 * @returns The discounted price
 */
export function calculateDiscountedPrice(
  originalPrice: number,
  discountPercentage: number,
): number {
  if (discountPercentage <= 0) return originalPrice
  if (discountPercentage >= 100) return 0

  return originalPrice - (originalPrice * discountPercentage) / 100
}

/**
 * Calculate discount amount from original price and discount percentage
 * @param originalPrice - The original price
 * @param discountPercentage - The discount percentage (0-100)
 * @returns The discount amount
 */
export function calculateDiscountAmount(
  originalPrice: number,
  discountPercentage: number,
): number {
  if (discountPercentage <= 0) return 0
  if (discountPercentage >= 100) return originalPrice

  return (originalPrice * discountPercentage) / 100
}

/**
 * Calculate total price for an item with quantity and discount
 * @param price - The base price per unit
 * @param quantity - The quantity
 * @param discountPercentage - Optional discount percentage
 * @returns The total price for the item
 */
export function calculateItemTotal(
  price: number,
  quantity: number,
  discountPercentage?: number,
): number {
  const unitPrice = discountPercentage
    ? calculateDiscountedPrice(price, discountPercentage)
    : price

  return unitPrice * quantity
}

/**
 * Calculate total savings from discounts
 * @param items - Array of cart items with price, quantity, and discountPercentage
 * @returns Total savings amount
 */
export function calculateTotalSavings(
  items: Array<{
    price: number
    quantity: number
    discountPercentage?: number
  }>,
): number {
  return items.reduce((totalSavings, item) => {
    if (item.discountPercentage && item.discountPercentage > 0) {
      const originalTotal = item.price * item.quantity
      const discountedTotal = calculateItemTotal(
        item.price,
        item.quantity,
        item.discountPercentage,
      )
      return totalSavings + (originalTotal - discountedTotal)
    }
    return totalSavings
  }, 0)
}

/**
 * Calculate subtotal (total before discounts)
 * @param items - Array of cart items with price and quantity
 * @returns Subtotal amount
 */
export function calculateSubtotal(
  items: Array<{
    price: number
    quantity: number
  }>,
): number {
  return items.reduce((subtotal, item) => {
    return subtotal + item.price * item.quantity
  }, 0)
}

/**
 * Calculate final total (subtotal - discounts + shipping)
 * @param subtotal - The subtotal amount
 * @param discounts - The total discount amount
 * @param shipping - The shipping cost (default: 0)
 * @returns Final total amount
 */
export function calculateFinalTotal(
  subtotal: number,
  discounts: number = 0,
  shipping: number = 0,
): number {
  return subtotal - discounts + shipping
}

/**
 * Format discount percentage for display
 * @param percentage - The discount percentage
 * @returns Formatted percentage string
 */
export function formatDiscountPercentage(percentage: number): string {
  return `-${percentage.toFixed(1)}%`
}

/**
 * Calculate and format savings display
 * @param originalPrice - The original price
 * @param discountedPrice - The discounted price
 * @returns Object with savings amount and formatted strings
 */
export function calculateSavings(
  originalPrice: number,
  discountedPrice: number,
) {
  const savingsAmount = originalPrice - discountedPrice
  const savingsPercentage =
    originalPrice > 0 ? (savingsAmount / originalPrice) * 100 : 0

  return {
    amount: savingsAmount,
    percentage: savingsPercentage,
    formattedAmount: formatPrice(savingsAmount),
    formattedPercentage: formatDiscountPercentage(savingsPercentage),
  }
}

/**
 * Validate pricing calculations
 * @param items - Array of cart items
 * @returns Object with validation results and calculations
 */
export function validatePricingCalculations(
  items: Array<{
    id: number
    price: number
    quantity: number
    discountPercentage?: number
  }>,
) {
  const subtotal = calculateSubtotal(items)
  const totalSavings = calculateTotalSavings(items)
  const finalTotal = calculateFinalTotal(subtotal, totalSavings)

  // Calculate total using individual item calculations
  const itemTotals = items.map(item =>
    calculateItemTotal(item.price, item.quantity, item.discountPercentage),
  )
  const calculatedTotal = itemTotals.reduce((sum, total) => sum + total, 0)

  return {
    subtotal,
    totalSavings,
    finalTotal,
    calculatedTotal,
    isValid: Math.abs(finalTotal - calculatedTotal) < 0.01, // Allow for small floating point differences
    itemTotals,
    formattedSubtotal: formatPrice(subtotal),
    formattedSavings: formatPrice(totalSavings),
    formattedTotal: formatPrice(finalTotal),
  }
}
