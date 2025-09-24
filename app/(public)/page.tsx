import { HeroSection, ThemeDemo } from '@/components/features/home'
import { ActionButtons } from '@/components/forms'
import { getTenantConfig } from '@/lib/tenant'
import { headers } from 'next/headers'

// ISR Configuration for subdomain-based tenants
export const revalidate = 3600 // Revalidate every hour

export default async function HomePage() {
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  const config = await getTenantConfig(tenantId)

  return (
    <main className='min-h-screen bg-background'>
      {/* Hero Section with Dynamic Theming */}
      <HeroSection
        headline={config.content.hero.headline}
        description={config.content.hero.description}
      />

      {/* Call to Action */}
      <section className='pb-16 px-4'>
        <div className='max-w-4xl mx-auto text-center'>
          <ActionButtons primaryText='Get Started' secondaryText='Learn More' />
        </div>
      </section>
      {/* Features Section */}
      <section className='py-16 px-4 bg-surface'>
        <div className='max-w-6xl mx-auto'>
          <h2 className='text-3xl font-bold text-text text-center mb-12 font-heading'>
            Why Choose {config.name}?
          </h2>

          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center p-6 bg-background rounded-lg shadow-sm border border-border'>
              <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-background text-2xl font-bold'>✓</span>
              </div>
              <h3 className='text-xl font-semibold text-text mb-2 font-heading'>
                Quality Service
              </h3>
              <p className='text-muted font-body'>
                Professional and reliable service for all your needs
              </p>
            </div>

            <div className='text-center p-6 bg-background rounded-lg shadow-sm border border-border'>
              <div className='w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-background text-2xl font-bold'>$</span>
              </div>
              <h3 className='text-xl font-semibold text-text mb-2 font-heading'>
                Competitive Pricing
              </h3>
              <p className='text-muted font-body'>
                Affordable pricing with transparent fees and no hidden costs
              </p>
            </div>

            <div className='text-center p-6 bg-background rounded-lg shadow-sm border border-border'>
              <div className='w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-background text-2xl font-bold'>★</span>
              </div>
              <h3 className='text-xl font-semibold text-text mb-2 font-heading'>
                Excellent Support
              </h3>
              <p className='text-muted font-body'>
                Dedicated customer support and seamless experience
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className='mb-16'></section>
      {/* Theme Demo Section (for development) */}
      {process.env.NODE_ENV === 'development' && (
        <section className='py-16 px-4'>
          <div className='max-w-6xl mx-auto'>
            <ThemeDemo showValidation={true} />
          </div>
        </section>
      )}
    </main>
  )
}
