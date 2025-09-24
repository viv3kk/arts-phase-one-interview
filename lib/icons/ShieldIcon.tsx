import { SVGProps } from 'react'

interface ShieldIconProps extends SVGProps<SVGSVGElement> {
  size?: number
  className?: string
}

export function ShieldIcon({
  size = 20,
  className = '',
  ...props
}: ShieldIconProps) {
  return (
    <svg
      viewBox='0 0 24 24'
      width={size}
      height={size}
      className={className}
      fill='none'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' />
    </svg>
  )
}
