import {
  calculateDailyRate,
  calculateDiscountAmount,
  centsToDollars,
  dateToSeconds,
  dollarsToCents,
  formatPrice,
} from '../price-utils'

describe('Price Utilities', () => {
  describe('centsToDollars', () => {
    it('should convert cents to dollars correctly', () => {
      expect(centsToDollars(100)).toBe(1)
      expect(centsToDollars(150)).toBe(1.5) // float value
      expect(centsToDollars(149)).toBe(1.49) // float value
      expect(centsToDollars(9600)).toBe(96)
      expect(centsToDollars(2000)).toBe(20)
    })

    it('should handle zero and negative values', () => {
      expect(centsToDollars(0)).toBe(0)
      expect(centsToDollars(-100)).toBe(-1)
    })
  })

  describe('dollarsToCents', () => {
    it('should convert dollars to cents correctly', () => {
      expect(dollarsToCents(1)).toBe(100)
      expect(dollarsToCents(1.5)).toBe(150)
      expect(dollarsToCents(96)).toBe(9600)
      expect(dollarsToCents(20)).toBe(2000)
    })

    it('should handle zero and negative values', () => {
      expect(dollarsToCents(0)).toBe(0)
      expect(dollarsToCents(-1)).toBe(-100)
    })
  })

  describe('calculateDailyRate', () => {
    it('should calculate daily rate correctly', () => {
      expect(calculateDailyRate(9600, 1)).toBe(96)
      expect(calculateDailyRate(9600, 2)).toBe(48)
      expect(calculateDailyRate(10000, 5)).toBe(20)
    })

    it('should handle edge cases', () => {
      expect(calculateDailyRate(0, 1)).toBe(0)
      expect(calculateDailyRate(100, 0)).toBe(Infinity) // division by zero
    })
  })

  describe('calculateDiscountAmount', () => {
    it('should calculate discount amount correctly', () => {
      expect(calculateDiscountAmount(9600, 10)).toBe(9.6) // 10% of 96.00 = 9.60
      expect(calculateDiscountAmount(10000, 5)).toBe(5) // 5% of 100.00 = 5.00
      expect(calculateDiscountAmount(5000, 20)).toBe(10) // 20% of 50.00 = 10.00
    })

    it('should handle zero discount', () => {
      expect(calculateDiscountAmount(9600, 0)).toBe(0)
    })
  })

  describe('formatPrice', () => {
    it('should format price correctly with default currency', () => {
      expect(formatPrice(96)).toBe('$96')
      expect(formatPrice(1000)).toBe('$1,000')
      expect(formatPrice(1234567)).toBe('$1,234,567')
    })

    it('should format price with custom currency', () => {
      expect(formatPrice(96, '€')).toBe('€96')
      expect(formatPrice(1000, '£')).toBe('£1,000')
    })

    it('should handle zero and negative values', () => {
      expect(formatPrice(0)).toBe('$0')
      expect(formatPrice(-100)).toBe('$-100')
    })
  })

  describe('dateToSeconds', () => {
    it('should convert date to seconds correctly', () => {
      const testDate = new Date('2024-01-15T10:30:00Z')
      const expectedSeconds = Math.floor(testDate.getTime() / 1000)
      expect(dateToSeconds(testDate)).toBe(expectedSeconds)
    })

    it('should handle null and undefined values', () => {
      expect(dateToSeconds(null)).toBeUndefined()
      expect(dateToSeconds(undefined)).toBeUndefined()
    })
  })
})
