'use client'

import { isDevelopment } from '@/lib/utils'
import {
  generateTenantSwitchUrl,
  getCurrentTenant,
} from '@/lib/utils/client-tenant-utils'
import { getDevTenantList, type DevTenantInfo } from '@/lib/utils/dev-utils'
import { useEffect, useRef, useState } from 'react'

/**
 * Combined development tools component
 * Draggable bubble with tenant switcher and dev info
 */
export function DevTools() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentTenant, setCurrentTenant] = useState<string | null>(null)
  const [tenants, setTenants] = useState<DevTenantInfo[]>([])
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const bubbleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isDevelopment()) return

    // Load tenant data
    setTenants(getDevTenantList())
    setCurrentTenant(getCurrentTenant())

    // Load saved position from localStorage
    const savedPosition = localStorage.getItem('devtools-position')
    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition))
      } catch {
        // Use default position if parsing fails
      }
    }
  }, [])

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem('devtools-position', JSON.stringify(position))
  }, [position])

  // Handle mouse events for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!bubbleRef.current) return

    const rect = bubbleRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
    setIsDragging(true)
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y

      // Keep within viewport bounds
      const maxX = window.innerWidth - 300
      const maxY = window.innerHeight - 60

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  // Don't render in production
  if (!isDevelopment()) {
    return null
  }

  const switchTenant = (tenantId: string | null) => {
    if (tenantId) {
      window.location.href = generateTenantSwitchUrl(tenantId)
    } else {
      // Switch to no tenant (main domain)
      const url = new URL(window.location.href)
      if (url.hostname === 'localhost') {
        url.searchParams.delete('tenant')
        window.location.href = url.toString()
      } else {
        const rootDomain =
          process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'aetheraiapp.com'
        const port = url.port ? `:${url.port}` : ''
        window.location.href = `${url.protocol}//${rootDomain}${port}${url.pathname}${url.search}`
      }
    }
  }

  return (
    <>
      {/* Main bubble */}
      <div
        ref={bubbleRef}
        className={`fixed z-50 select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{
          left: position.x,
          bottom: position.y,
        }}
      >
        <div className='relative'>
          {/* Bubble button */}
          <div
            className='bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105'
            onMouseDown={handleMouseDown}
            onClick={() => !isDragging && setIsOpen(!isOpen)}
            title='Development Tools (Drag to move)'
          >
            <span className='text-lg'>🔧</span>
          </div>

          {/* Expanded panel */}
          {isOpen && (
            <div className='absolute bottom-14 left-0 bg-white rounded-lg shadow-2xl border border-gray-200 min-w-80 max-w-sm'>
              {/* Header */}
              <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-t-lg'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='font-semibold text-sm'>Development Tools</h3>
                    <p className='text-xs opacity-90'>Multi-tenant Platform</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className='text-white hover:bg-white hover:bg-opacity-20 rounded p-1 transition-colors'
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Current tenant info */}
              <div className='p-3 border-b border-gray-100 bg-gray-50'>
                <div className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>
                  Current Context
                </div>
                <div className='space-y-1 text-sm'>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Tenant:</span>
                    <span className='font-mono text-blue-600'>
                      {currentTenant || 'None'}
                    </span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Host:</span>
                    <span className='font-mono text-green-600 text-xs'>
                      {typeof window !== 'undefined'
                        ? window.location.hostname
                        : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tenant switcher */}
              <div className='p-3'>
                <div className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2'>
                  Switch Tenant
                </div>

                {/* No tenant option */}
                <button
                  onClick={() => switchTenant(null)}
                  className={`w-full text-left p-2 rounded mb-1 text-sm transition-colors ${
                    !currentTenant
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className='font-medium'>No Tenant</div>
                  <div className='text-xs text-gray-500'>Main domain</div>
                </button>

                {/* Tenant options */}
                <div className='space-y-1 max-h-40 overflow-y-auto'>
                  {tenants.map(tenant => (
                    <button
                      key={tenant.id}
                      onClick={() => switchTenant(tenant.id)}
                      className={`w-full text-left p-2 rounded text-sm transition-colors ${
                        currentTenant === tenant.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className='font-medium'>{tenant.name}</div>
                      <div className='text-xs text-gray-500 font-mono'>
                        {tenant.id}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className='p-3 border-t border-gray-100 bg-gray-50 rounded-b-lg'>
                <div className='text-xs text-gray-500 flex items-center justify-between'>
                  <span>💡 Drag bubble to move</span>
                  <span className='font-mono'>{tenants.length} tenants</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div className='fixed inset-0 z-40' onClick={() => setIsOpen(false)} />
      )}
    </>
  )
}

// Legacy exports for backward compatibility
export const TenantSwitcher = DevTools
export const DevInfoPanel = () => null
