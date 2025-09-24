import { loadStripe, Stripe } from '@stripe/stripe-js'

// Get the publishable key from environment variables
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

// Only throw error in browser environment, not during build
if (typeof window !== 'undefined' && !stripePublishableKey) {
  throw new Error(
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined in environment variables',
  )
}

// Initialize Stripe instance
let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
  // Return null if no publishable key is available (e.g., during build)
  if (!stripePublishableKey) {
    return Promise.resolve(null)
  }

  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey)
  }
  return stripePromise
}
