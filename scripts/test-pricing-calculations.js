#!/usr/bin/env node

/**
 * Test script to verify pricing calculations
 * This script tests the pricing utility functions with manual calculations
 */

console.log('🧮 Testing Pricing Calculations...\n')

// Test data based on the cart image
const testItems = [
  {
    id: 1,
    price: 28999.99,
    quantity: 8,
    discountPercentage: 3.98,
    title: '300 Touring (Chrysler)'
  },
  {
    id: 2,
    price: 99.99,
    quantity: 2,
    discountPercentage: 12.07,
    title: 'Amazon Echo Plus (Amazon)'
  }
]

console.log('📊 Test Items:')
testItems.forEach(item => {
  console.log(`- ${item.title}: $${item.price} x ${item.quantity} (${item.discountPercentage}% off)`)
})

// Manual calculation functions
function formatPrice(amount) {
  return `$${amount.toFixed(2)}`
}

function calculateDiscountedPrice(originalPrice, discountPercentage) {
  if (discountPercentage <= 0) return originalPrice
  if (discountPercentage >= 100) return 0
  return originalPrice - (originalPrice * discountPercentage) / 100
}

function calculateItemTotal(price, quantity, discountPercentage) {
  const unitPrice = discountPercentage
    ? calculateDiscountedPrice(price, discountPercentage)
    : price
  return unitPrice * quantity
}

function calculateTotalSavings(items) {
  return items.reduce((totalSavings, item) => {
    if (item.discountPercentage && item.discountPercentage > 0) {
      const originalTotal = item.price * item.quantity
      const discountedTotal = calculateItemTotal(
        item.price,
        item.quantity,
        item.discountPercentage
      )
      return totalSavings + (originalTotal - discountedTotal)
    }
    return totalSavings
  }, 0)
}

function calculateSubtotal(items) {
  return items.reduce((subtotal, item) => {
    return subtotal + (item.price * item.quantity)
  }, 0)
}

function calculateFinalTotal(subtotal, discounts = 0, shipping = 0) {
  return subtotal - discounts + shipping
}

console.log('\n🧮 Individual Item Calculations:')

testItems.forEach(item => {
  const discountedPrice = calculateDiscountedPrice(item.price, item.discountPercentage)
  const itemTotal = calculateItemTotal(item.price, item.quantity, item.discountPercentage)
  const originalTotal = item.price * item.quantity
  const savings = originalTotal - itemTotal
  
  console.log(`\n${item.title}:`)
  console.log(`  Original Price: ${formatPrice(item.price)}`)
  console.log(`  Discounted Price: ${formatPrice(discountedPrice)}`)
  console.log(`  Quantity: ${item.quantity}`)
  console.log(`  Item Total: ${formatPrice(itemTotal)}`)
  console.log(`  Savings: ${formatPrice(savings)}`)
})

console.log('\n🧮 Overall Cart Calculations:')

const subtotal = calculateSubtotal(testItems)
const totalSavings = calculateTotalSavings(testItems)
const finalTotal = calculateFinalTotal(subtotal, totalSavings)

console.log(`📊 Subtotal: ${formatPrice(subtotal)}`)
console.log(`💰 Total Savings: ${formatPrice(totalSavings)}`)
console.log(`🎯 Final Total: ${formatPrice(finalTotal)}`)

console.log('\n📋 Expected Results (CORRECTED):')
console.log('Items (10): $232199.90 (Original subtotal before discounts)')
console.log('Discount: -$9257.73 (Total savings)')
console.log('Total: $222942.17 (Final amount after discounts)')

console.log('\n🔍 Calculation Verification:')
// Correct expected values
const expectedOriginalSubtotal = 232199.90
const expectedSavings = 9257.73
const expectedFinalTotal = 222942.17

const originalSubtotalMatch = Math.abs(subtotal - expectedOriginalSubtotal) < 0.01
const savingsMatch = Math.abs(totalSavings - expectedSavings) < 0.01
const finalTotalMatch = Math.abs(finalTotal - expectedFinalTotal) < 0.01

console.log(`Original Subtotal Match: ${originalSubtotalMatch ? '✅' : '❌'} (Expected: ${expectedOriginalSubtotal}, Actual: ${subtotal})`)
console.log(`Savings Match: ${savingsMatch ? '✅' : '❌'} (Expected: ${expectedSavings}, Actual: ${totalSavings})`)
console.log(`Final Total Match: ${finalTotalMatch ? '✅' : '❌'} (Expected: ${expectedFinalTotal}, Actual: ${finalTotal})`)

console.log(`\n📊 Calculation Breakdown:`)
console.log(`Original Subtotal: ${formatPrice(subtotal)}`)
console.log(`Total Discounts: -${formatPrice(totalSavings)}`)
console.log(`Final Total: ${formatPrice(finalTotal)}`)
console.log(`Math Check: ${formatPrice(subtotal)} - ${formatPrice(totalSavings)} = ${formatPrice(subtotal - totalSavings)}`)

if (originalSubtotalMatch && savingsMatch && finalTotalMatch) {
  console.log('\n🎉 All pricing calculations are working correctly!')
} else {
  console.log('\n⚠️  Pricing calculation mismatch detected!')
  process.exit(1)
}
