/**
 * Product Detail Layout Component
 * Main layout container for product detail page
 */

interface ProductDetailLayoutProps {
  children: React.ReactNode
}

export function ProductDetailLayout({ children }: ProductDetailLayoutProps) {
  return <div className='space-y-6'>{children}</div>
}
