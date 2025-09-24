/**
 * Base Modal Wrapper Component
 * Provides consistent modal structure with backdrop and escape key handling
 */
'use client'

import { Portal } from './portal'
import { useEffect } from 'react'
import { Button } from './button'
import { ChevronLeft, X } from 'lucide-react'

interface BaseModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  showCloseButton?: boolean
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
  showBackButton?: boolean
  onBack?: () => void
}

export function BaseModal({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showBackButton = false,
  onBack,
}: BaseModalProps) {
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose, closeOnEscape])

  // Don't render if not open
  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <Portal>
      <div className='fixed inset-0 z-50 flex items-center justify-center '>
        {/* Backdrop */}
        <div
          className='fixed inset-0 bg-black/30 ' //use bg-black/50 backdrop-blur-sm to add a blur effect
          onClick={handleBackdropClick}
        />

        {/* Modal Content */}
        <div className='relative bg-background rounded-lg shadow-lg border  w-full mx-4 max-h-[90vh] max-w-[568px] overflow-hidden'>
          {/* Header */}
          {(title || showCloseButton || showBackButton) && (
            <div className='flex items-center justify-between p-4 border-b'>
              <div className='flex items-center'>
                {showBackButton && onBack ? (
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={onBack}
                    className='h-8 w-8 hover:bg-gray-200 hover:text-black cursor-pointer'
                    aria-label='Go back'
                  >
                    <ChevronLeft />
                  </Button>
                ) : showCloseButton ? (
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={onClose}
                    className='h-8 w-8 hover:bg-gray-200 hover:text-black cursor-pointer'
                    aria-label='Close modal'
                  >
                    <X className='h-4 w-4' />
                  </Button>
                ) : null}
              </div>
              {title && (
                <h2 className='text-xl font-bold text-foreground'>{title}</h2>
              )}
              <div className='w-8' />{' '}
              {/* Spacer to maintain center alignment */}
            </div>
          )}

          {/* Content */}
          <div className='p-6'>{children}</div>
        </div>
      </div>
    </Portal>
  )
}
