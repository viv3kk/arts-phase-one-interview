/**
 * SSR-safe Portal component
 * Renders children into a different DOM node while maintaining SSR compatibility
 */
'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface PortalProps {
  children: React.ReactNode
  container?: Element | null
  containerId?: string
}

export function Portal({
  children,
  container,
  containerId = 'modal-root',
}: PortalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  // Use provided container or find by ID
  const targetContainer = container || document.getElementById(containerId)

  if (!targetContainer) {
    console.warn(`Portal container with id "${containerId}" not found`)
    return null
  }

  return createPortal(children, targetContainer)
}
