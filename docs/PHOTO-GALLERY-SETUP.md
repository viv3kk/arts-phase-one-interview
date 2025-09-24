# Photo Gallery Component Setup

## Overview

The Photo Gallery component displays vehicle images in a responsive grid layout with a full-screen modal view. It automatically generates image URLs using the `NEXT_PUBLIC_BASE_IMAGE_URL` environment variable.

## Environment Configuration

Add the following environment variable to your `.env.local` file:

```bash
NEXT_PUBLIC_BASE_IMAGE_URL=https://your-api-domain.com
```

**Example:**

```bash
NEXT_PUBLIC_BASE_IMAGE_URL=https://qa-api.htravelss.com
```

## How It Works

1. **Image URL Generation**: The component uses `createImageUrl()` utility to combine the base URL with relative paths from the API
2. **Grid Layout**: Shows 5 images in a 4-column grid (1 large + 4 small)
3. **Modal View**: Click any image to open a full-screen gallery
4. **Responsive**: Adapts to different screen sizes

## Usage

```tsx
import { PhotoGallery } from '@/components/features/vehicle'

// In your component
;<PhotoGallery images={vehicle.images} />
```

## API Response Format

The component expects images in this format:

```typescript
interface VehicleImage {
  id: string
  name: string
  relativePath: string
}
```

## Features

- ✅ **Automatic URL generation** from relative paths
- ✅ **Responsive grid layout** (4-column grid)
- ✅ **Full-screen modal** for viewing all images
- ✅ **Hover effects** and smooth transitions
- ✅ **Fallback handling** for missing images
- ✅ **Accessibility** with proper alt text
- ✅ **Mobile-friendly** touch interactions

## Image URL Logic

```
Final URL = NEXT_PUBLIC_BASE_IMAGE_URL + relativePath

Example:
Base URL: https://qa-api.htravelss.com
Relative Path: vehicle_images/adcc674c-494a-4b27-93d1-54b9f5fdc5f3.png
Final URL: https://qa-api.htravelss.com/vehicle_images/adcc674c-494a-4b27-93d1-54b9f5fdc5f3.png
```
