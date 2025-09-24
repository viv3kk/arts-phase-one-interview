/**
 * Date and time utility functions
 * Provides consistent date handling across the application
 */

/**
 * Convert a Date object to Unix timestamp (seconds)
 */
export function dateToTimestamp(date: Date): number {
  return Math.floor(date.getTime() / 1000)
}

/**
 * Convert Unix timestamp (seconds) to Date object
 */
export function timestampToDate(timestamp: number): Date {
  return new Date(timestamp * 1000)
}

/**
 * Get current timestamp in seconds
 */
export function getCurrentTimestamp(): number {
  return dateToTimestamp(new Date())
}

/**
 * Create a Date object with specific time
 * @param date - The base date
 * @param timeString - Time string in HH:mm format (e.g., "10:00")
 */
export function createDateWithTime(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number)
  const newDate = new Date(date)
  newDate.setHours(hours, minutes, 0, 0)
  return newDate
}

/**
 * Format date for display
 */
export function formatDate(
  date: Date,
  options?: Intl.DateTimeFormatOptions,
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }
  return new Intl.DateTimeFormat('en-US', defaultOptions).format(date)
}

/**
 * Format time for display
 */
export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

/**
 * Calculate the difference between two dates in days
 */
export function calculateDaysDifference(
  startDate: Date,
  endDate: Date,
): number {
  const timeDiff = endDate.getTime() - startDate.getTime()
  return Math.ceil(timeDiff / (1000 * 3600 * 24))
}

/**
 * Add days to a date
 */
export function addDays(date: Date, days: number): Date {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}

/**
 * Check if a date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date): boolean {
  return date < new Date()
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date): boolean {
  return date > new Date()
}
