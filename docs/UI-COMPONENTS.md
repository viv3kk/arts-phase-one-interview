# UI Components Documentation

## Overview

This project uses **shadcn/ui** components integrated with our custom theme system. All components automatically adapt to tenant themes through CSS custom properties.

## Component Library

### Buttons

#### Basic Usage

```tsx
import { Button } from '@/components/ui/button'

function MyComponent() {
  return (
    <div className='space-x-4'>
      <Button>Default</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='outline'>Outline</Button>
      <Button variant='ghost'>Ghost</Button>
      <Button variant='link'>Link</Button>
      <Button variant='destructive'>Destructive</Button>
    </div>
  )
}
```

#### Sizes

```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">
  <Icon className="h-4 w-4" />
</Button>
```

#### Loading State

```tsx
<Button disabled>
  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
  Loading...
</Button>
```

### Cards

#### Basic Card

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function ProductCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Name</CardTitle>
        <CardDescription>Product description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Product details and content</p>
      </CardContent>
    </Card>
  )
}
```

#### Card with Actions

```tsx
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function ActionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Special Offer</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Get 20% off your next rental!</p>
      </CardContent>
      <CardFooter>
        <Button className='w-full'>Claim Offer</Button>
      </CardFooter>
    </Card>
  )
}
```

### Form Components

#### Input Fields

```tsx
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function ContactForm() {
  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          placeholder='Enter your email'
          required
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='message'>Message</Label>
        <Textarea id='message' placeholder='Your message here...' rows={4} />
      </div>
    </div>
  )
}
```

#### Select Dropdown

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function VehicleSelector() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder='Select vehicle type' />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='sedan'>Sedan</SelectItem>
        <SelectItem value='suv'>SUV</SelectItem>
        <SelectItem value='truck'>Truck</SelectItem>
      </SelectContent>
    </Select>
  )
}
```

### Badges

```tsx
import { Badge } from '@/components/ui/badge'

function StatusBadges() {
  return (
    <div className='space-x-2'>
      <Badge>Available</Badge>
      <Badge variant='secondary'>Pending</Badge>
      <Badge variant='outline'>Reserved</Badge>
      <Badge variant='destructive'>Unavailable</Badge>
    </div>
  )
}
```

## Custom Components

### ActionButtons

A specialized component for call-to-action sections:

```tsx
import { ActionButtons } from '@/components/ui/ActionButtons'

function HeroSection() {
  return (
    <section className='text-center'>
      <h1>Welcome to Our Service</h1>
      <ActionButtons primaryText='Get Started' secondaryText='Learn More' />
    </section>
  )
}
```

### ThemeDemo

Showcases how components look with the current theme:

```tsx
import { ThemeDemo } from '@/components/ui/ThemeDemo'

function StyleGuidePage() {
  return (
    <div>
      <h1>Style Guide</h1>
      <ThemeDemo showValidation={true} />
    </div>
  )
}
```

### HeroSection

Reusable hero section component:

```tsx
import { HeroSection } from '@/components/ui/HeroSection'

function HomePage() {
  return (
    <HeroSection
      headline='Your Amazing Service'
      description='Transform your business with our solutions'
    />
  )
}
```

## Theme Integration

### Automatic Theme Adaptation

All shadcn/ui components automatically adapt to the current tenant's theme:

```tsx
// This button will be red for Fire theme, blue for Ocean theme, etc.
<Button>Themed Button</Button>
```

### Using Theme Colors Directly

Access theme colors in your components:

```tsx
import { useAppliedTheme } from '@/components/providers/ThemeProvider'

function CustomComponent() {
  const theme = useAppliedTheme()

  return (
    <div
      style={{
        backgroundColor: theme.primary,
        color: theme.background,
      }}
    >
      Custom themed element
    </div>
  )
}
```

### Semantic CSS Classes

Use semantic classes that automatically map to theme colors:

```tsx
function ThemedComponent() {
  return (
    <div className='bg-primary text-primary-foreground p-4 rounded-lg'>
      <h3 className='text-lg font-semibold'>Themed Card</h3>
      <p className='text-primary-foreground/80'>
        This card adapts to the current theme automatically.
      </p>
      <Button variant='secondary' className='mt-4'>
        Action Button
      </Button>
    </div>
  )
}
```

## Styling Guidelines

### Color Usage

| Purpose           | Semantic Class          | When to Use                               |
| ----------------- | ----------------------- | ----------------------------------------- |
| Primary actions   | `bg-primary`            | Main CTAs, primary buttons                |
| Secondary actions | `bg-secondary`          | Secondary buttons, less important actions |
| Backgrounds       | `bg-background`         | Page backgrounds, card backgrounds        |
| Text              | `text-foreground`       | Primary text content                      |
| Muted text        | `text-muted-foreground` | Secondary text, descriptions              |
| Borders           | `border-border`         | Card borders, dividers                    |

### Component Composition

#### Building Complex Forms

```tsx
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

function BookingForm() {
  return (
    <Card className='max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Book Your Vehicle</CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='pickup'>Pickup Date</Label>
            <Input id='pickup' type='date' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='return'>Return Date</Label>
            <Input id='return' type='date' />
          </div>
        </div>

        <div className='space-y-2'>
          <Label>Vehicle Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder='Choose vehicle' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='economy'>Economy</SelectItem>
              <SelectItem value='compact'>Compact</SelectItem>
              <SelectItem value='midsize'>Midsize</SelectItem>
              <SelectItem value='luxury'>Luxury</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className='w-full'>Book Now</Button>
      </CardContent>
    </Card>
  )
}
```

#### Feature Cards Grid

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

function FeaturesGrid() {
  const features = [
    {
      title: 'Fast Delivery',
      description: 'Get your vehicle within 30 minutes',
      badge: 'Popular',
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer assistance',
      badge: 'Premium',
    },
    {
      title: 'Insurance Included',
      description: 'Comprehensive coverage included',
      badge: 'Essential',
    },
  ]

  return (
    <div className='grid md:grid-cols-3 gap-6'>
      {features.map((feature, index) => (
        <Card key={index}>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg'>{feature.title}</CardTitle>
              <Badge variant='outline'>{feature.badge}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className='text-muted-foreground'>{feature.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

## Accessibility

### Keyboard Navigation

All shadcn/ui components support proper keyboard navigation:

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and selections
- **Arrow keys**: Navigate within menus and selects
- **Esc**: Close modals and dropdowns

### Screen Reader Support

Components include proper ARIA attributes:

```tsx
<Button
  aria-label="Add item to cart"
  aria-describedby="cart-help-text"
>
  Add to Cart
</Button>
<span id="cart-help-text" className="sr-only">
  This will add the selected vehicle to your booking cart
</span>
```

### Focus Management

Ensure proper focus indicators:

```tsx
<Button className='focus-visible:ring-2 focus-visible:ring-primary'>
  Accessible Button
</Button>
```

## Performance Considerations

### Bundle Size

shadcn/ui components are tree-shakeable. Only import what you need:

```tsx
// ✅ Good - only imports needed components
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// ❌ Avoid - imports entire library
import * as UI from '@/components/ui'
```

### CSS-in-JS vs CSS Variables

Our theme system uses CSS variables for optimal performance:

- **Server-side rendering**: Themes injected at build time
- **No runtime overhead**: No JavaScript theme switching
- **Cache-friendly**: Static CSS generation

### Component Lazy Loading

For large applications, consider lazy loading:

```tsx
import { lazy, Suspense } from 'react'

const ThemeDemo = lazy(() => import('@/components/ui/ThemeDemo'))

function StyleGuidePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ThemeDemo />
    </Suspense>
  )
}
```

## Testing Components

### Unit Testing

```tsx
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { Button } from '@/components/ui/button'

test('button renders with theme colors', () => {
  render(
    <ThemeProvider>
      <Button>Test Button</Button>
    </ThemeProvider>,
  )

  const button = screen.getByRole('button', { name: /test button/i })
  expect(button).toBeInTheDocument()
  expect(button).toHaveClass('bg-primary')
})
```

### Visual Testing

Use tools like Storybook for visual regression testing:

```tsx
// Button.stories.tsx
export default {
  title: 'UI/Button',
  component: Button,
  parameters: {
    themes: {
      list: [
        { name: 'Ocean', class: 'theme-ocean' },
        { name: 'Fire', class: 'theme-fire' },
        { name: 'Forest', class: 'theme-forest' },
      ],
    },
  },
}

export const AllVariants = () => (
  <div className='space-x-4'>
    <Button>Default</Button>
    <Button variant='outline'>Outline</Button>
    <Button variant='ghost'>Ghost</Button>
  </div>
)
```

## Common Patterns

### Loading States

```tsx
function SubmitButton({ isLoading }: { isLoading: boolean }) {
  return (
    <Button disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          Submitting...
        </>
      ) : (
        'Submit'
      )}
    </Button>
  )
}
```

### Conditional Styling

```tsx
function StatusCard({ status }: { status: 'active' | 'pending' | 'error' }) {
  return (
    <Card
      className={cn(
        'border-2',
        status === 'active' && 'border-green-500',
        status === 'pending' && 'border-yellow-500',
        status === 'error' && 'border-red-500',
      )}
    >
      <CardContent>
        <Badge
          variant={
            status === 'active'
              ? 'default'
              : status === 'pending'
                ? 'secondary'
                : 'destructive'
          }
        >
          {status}
        </Badge>
      </CardContent>
    </Card>
  )
}
```

### Responsive Design

```tsx
function ResponsiveGrid() {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
      {items.map(item => (
        <Card key={item.id} className='h-full'>
          <CardContent className='p-4'>{/* Card content */}</CardContent>
        </Card>
      ))}
    </div>
  )
}
```
