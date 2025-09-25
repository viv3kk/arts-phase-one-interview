import { getTenantConfig } from '@/lib/tenant'
import { headers } from 'next/headers'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// ISR Configuration for subdomain-based tenants
export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  const _config = await getTenantConfig(tenantId)

  return (
    <main className='min-h-screen bg-background'>
      {/* Hero Section */}
      <section className='py-20 px-4'>
        <div className='max-w-4xl mx-auto text-center'>
          <h1 className='text-4xl md:text-6xl font-bold text-foreground mb-6 font-heading'>
            Welcome to InstaShop
          </h1>
          <p className='text-xl text-muted-foreground mb-8 font-body max-w-2xl mx-auto'>
            Your one-stop destination for quality products and exceptional
            service
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button asChild size='lg'>
              <Link href='/products'>Shop Now</Link>
            </Button>
            <Button variant='outline' asChild size='lg'>
              <Link href='/about'>Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16 px-4 bg-muted/50'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold text-foreground text-center mb-12 font-heading'>
            Why Choose InstaShop?
          </h2>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center p-6 bg-background rounded-lg shadow-sm border'>
              <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-primary-foreground text-2xl font-bold'>
                  ✓
                </span>
              </div>
              <h3 className='text-xl font-semibold text-foreground mb-2 font-heading'>
                Quality Products
              </h3>
              <p className='text-muted-foreground font-body'>
                Curated selection of high-quality products from trusted brands
              </p>
            </div>

            <div className='text-center p-6 bg-background rounded-lg shadow-sm border'>
              <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-primary-foreground text-2xl font-bold'>
                  🚚
                </span>
              </div>
              <h3 className='text-xl font-semibold text-foreground mb-2 font-heading'>
                Fast Delivery
              </h3>
              <p className='text-muted-foreground font-body'>
                Quick and reliable shipping to your doorstep
              </p>
            </div>

            <div className='text-center p-6 bg-background rounded-lg shadow-sm border'>
              <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-primary-foreground text-2xl font-bold'>
                  ★
                </span>
              </div>
              <h3 className='text-xl font-semibold text-foreground mb-2 font-heading'>
                Customer Support
              </h3>
              <p className='text-muted-foreground font-body'>
                Dedicated support team ready to help you anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-16 px-4'>
        <div className='max-w-4xl mx-auto text-center'>
          <h2 className='text-3xl font-bold text-foreground mb-4 font-heading'>
            Ready to Start Shopping?
          </h2>
          <p className='text-lg text-muted-foreground mb-8 font-body'>
            Discover our amazing collection of products today
          </p>
          <Button asChild size='lg'>
            <Link href='/products'>Browse Products</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
