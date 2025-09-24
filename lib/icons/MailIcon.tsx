import { SVGProps } from 'react'

interface MailIconProps extends SVGProps<SVGSVGElement> {
  size?: number
  className?: string
}

export function MailIcon({
  size = 20,
  className = '',
  ...props
}: MailIconProps) {
  return (
    <svg
      viewBox='0 0 24 24'
      width={size}
      height={size}
      className={className}
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' />
      <polyline points='22,6 12,13 2,6' />
    </svg>
  )
}
