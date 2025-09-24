interface HeroSectionProps {
  headline: string
  description: string
}

export function HeroSection({ headline, description }: HeroSectionProps) {
  return (
    <section className='py-20 px-4'>
      <div className='max-w-4xl mx-auto text-center'>
        <h1 className='text-5xl font-bold text-primary mb-6 font-heading'>
          {headline}
        </h1>
        <p className='text-xl text-text mb-8 max-w-2xl mx-auto font-body'>
          {description}
        </p>
      </div>
    </section>
  )
}
