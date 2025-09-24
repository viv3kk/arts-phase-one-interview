/**
 * Price conversion utilities
 * Handles cents to dollars conversion, price calculations, and datetime conversions
 */

/**
 * Convert cents to dollars
 * @param cents - Amount in cents
 * @returns Amount in dollars
 */
export function centsToDollars(cents: number): number {
  return cents / 100
}

/**
 * Convert dollars to cents
 * @param dollars - Amount in dollars
 * @returns Amount in cents
 */
export function dollarsToCents(dollars: number): number {
  return dollars * 100
}

/**
 * Calculate daily rate from total rental price and number of days
 * @param totalRentalPriceInCents - Total rental price in cents
 * @param totalDays - Number of days
 * @returns Daily rate in dollars
 */
export function calculateDailyRate(
  totalRentalPriceInCents: number,
  totalDays: number,
): number {
  return totalRentalPriceInCents / 100 / totalDays
}

/**
 * Calculate discount amount from percentage
 * @param totalPriceInCents - Total price in cents
 * @param discountPercentage - Discount percentage (0-100)
 * @returns Discount amount in dollars
 */
export function calculateDiscountAmount(
  totalPriceInCents: number,
  discountPercentage: number,
): number {
  return (totalPriceInCents * discountPercentage) / 100 / 100
}

/**
 * Format price for display
 * @param amount - Amount in dollars
 * @param currency - Currency symbol (default: '$')
 * @returns Formatted price string
 */
export function formatPrice(amount: number, currency = '$'): string {
  return `${currency}${amount.toLocaleString()}`
}

/**
 * Format price from cents (combines centsToDollars + formatPrice)
 * @param cents - Amount in cents
 * @param currency - Currency symbol (default: '$')
 * @returns Formatted price string
 */
export function formatPriceFromCents(cents: number, currency = '$'): string {
  return formatPrice(centsToDollars(cents), currency)
}

/**
 * Convert Date object to Unix timestamp in seconds
 * @param date - Date object to convert
 * @returns Unix timestamp in seconds, or undefined if date is null/undefined
 */
export function dateToSeconds(
  date: Date | null | undefined,
): number | undefined {
  if (!date) return undefined
  return Math.floor(date.getTime() / 1000)
}
