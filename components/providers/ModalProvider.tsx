/**
 * Modal Provider Component
 * Manages all modal states and renders modals using portal infrastructure
 */
'use client'

import { useAuth } from '@/lib/providers/StoreProvider'
import { ReactNode } from 'react'
import { OnboardingModal } from '../features/auth/OnboardingModal'

interface ModalProviderProps {
  children: ReactNode
}

export function ModalProvider({ children }: ModalProviderProps) {
  const { isModalOpen } = useAuth()

  return (
    <>
      {children}

      {/* Render LoginModal when modal state is open */}
      {isModalOpen && <OnboardingModal />}
    </>
  )
}
