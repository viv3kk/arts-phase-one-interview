'use client'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function LoadingSpinner({ size = 'sm' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-2 w-2',
    md: 'h-4 w-4',
    lg: 'h-6 w-6',
  }

  return (
    <div className='flex items-center justify-center space-x-2'>
      <div
        className={`${sizeClasses[size]} animate-bounce rounded-full bg-current [animation-delay:-0.3s]`}
      />
      <div
        className={`${sizeClasses[size]} animate-bounce rounded-full bg-current [animation-delay:-0.13s]`}
      />
      <div
        className={`${sizeClasses[size]} animate-bounce rounded-full bg-current`}
      />
    </div>
  )
}
