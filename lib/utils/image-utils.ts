import { useCallback, useState } from 'react'

/**
 * Creates a full image URL by combining the base URL with the relative path
 * @param relativePath - The relative path from the API response
 * @returns The complete image URL
 */
export function createImageUrl(relativePath: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_IMAGE_URL

  if (!baseUrl) {
    console.warn('NEXT_PUBLIC_BASE_IMAGE_URL environment variable is not set')
    return relativePath
  }

  // Remove leading slash if present in base URL
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl
  // Remove leading slash if present in relative path
  const cleanRelativePath = relativePath.startsWith('/')
    ? relativePath.slice(1)
    : relativePath

  return `${cleanBaseUrl}/${cleanRelativePath}`
}

/**
 * Creates image URLs for multiple images
 * @param images - Array of image objects with relativePath
 * @returns Array of complete image URLs
 */
export function createImageUrls<T extends { relativePath: string }>(
  images: T[],
): string[] {
  return images.map(image => createImageUrl(image.relativePath))
}

/**
 * Custom hook for lightbox functionality
 * @param slides - Array of image URLs for the lightbox
 * @param hideNavigation - Whether to hide navigation arrows (for single images)
 * @returns Lightbox state and handlers
 */
export function useLightbox(slides: string[], hideNavigation = false) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const handleImageClick = useCallback((index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }, [])

  const handleCloseLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const createSlideFromUrl = useCallback((url: string) => {
    return { src: url }
  }, [])

  const lightboxProps = {
    open: lightboxOpen,
    close: handleCloseLightbox,
    index: lightboxIndex,
    slides: slides.map(createSlideFromUrl),
    styles: {
      container: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
    },
    ...(hideNavigation && {
      carousel: { finite: true },
      render: {
        buttonPrev: () => null,
        buttonNext: () => null,
      },
    }),
  }

  return {
    lightboxOpen,
    lightboxIndex,
    handleImageClick,
    handleCloseLightbox,
    lightboxProps,
  }
}
