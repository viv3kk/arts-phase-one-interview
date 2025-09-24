/**
 * ThemeDemo component - Demonstrates shadcn/ui + dynamic theming capabilities
 * Shows how tenant colors are applied across shadcn/ui components
 * Requirements: 2.1, 2.2, 2.4, 2.5
 */

'use client'

import {
  useAppliedTheme,
  useThemeValidation,
} from '@/components/providers/ThemeProvider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ThemeDemoProps {
  showValidation?: boolean
}

/**
 * Demo component that showcases shadcn/ui + dynamic theming system
 */
export function ThemeDemo({ showValidation = false }: ThemeDemoProps) {
  const appliedTheme = useAppliedTheme()
  const { isValid, errors } = useThemeValidation()

  return (
    <div className='p-6 space-y-6'>
      <h2 className='text-2xl font-bold text-primary font-heading'>
        shadcn/ui + Dynamic Theme Demo
      </h2>

      {/* Font Demo */}
      <Card>
        <CardHeader>
          <CardTitle className='font-heading'>Typography System</CardTitle>
          <CardDescription>Different font families per theme</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Label className='text-sm font-medium text-gray-600'>
              Heading Font (font-heading)
            </Label>
            <h3 className='text-xl font-semibold font-heading'>
              This is a heading using the theme&apos;s heading font
            </h3>
          </div>
          <div>
            <Label className='text-sm font-medium text-gray-600'>
              Body Font (font-body)
            </Label>
            <p className='font-body'>
              This is body text using the theme&apos;s body font. It shows how
              different tenants can have unique typography that matches their
              brand identity.
            </p>
          </div>
          <div className='text-xs text-gray-500 font-mono'>
            Next.js optimized fonts with automatic preloading
          </div>
        </CardContent>
      </Card>

      {/* Color Swatches */}
      <div className='grid grid-cols-2 md:grid-cols-5 gap-4'>
        <div className='text-center'>
          <div
            className='w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-border'
            style={{ backgroundColor: appliedTheme.primary }}
          />
          <p className='text-sm text-muted-foreground'>Primary</p>
          <p className='text-xs font-mono text-foreground'>
            {appliedTheme.primary}
          </p>
        </div>

        <div className='text-center'>
          <div
            className='w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-border'
            style={{ backgroundColor: appliedTheme.secondary }}
          />
          <p className='text-sm text-muted-foreground'>Secondary</p>
          <p className='text-xs font-mono text-foreground'>
            {appliedTheme.secondary}
          </p>
        </div>

        <div className='text-center'>
          <div
            className='w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-border'
            style={{ backgroundColor: appliedTheme.background }}
          />
          <p className='text-sm text-muted-foreground'>Background</p>
          <p className='text-xs font-mono text-foreground'>
            {appliedTheme.background}
          </p>
        </div>

        <div className='text-center'>
          <div
            className='w-16 h-16 rounded-lg mx-auto mb-2 border-2 border-border'
            style={{ backgroundColor: appliedTheme.text }}
          />
          <p className='text-sm text-muted-foreground'>Text</p>
          <p className='text-xs font-mono text-foreground'>
            {appliedTheme.text}
          </p>
        </div>

        <div className='text-center'>
          <div className='w-16 h-16 bg-muted rounded-lg mx-auto mb-2 border-2 border-border' />
          <p className='text-sm text-muted-foreground'>Surface</p>
          <p className='text-xs font-mono text-foreground'>Auto-derived</p>
        </div>
      </div>

      {/* shadcn/ui Button Variants */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-foreground font-heading'>
          shadcn/ui Button Variants
        </h3>

        <div className='flex flex-wrap gap-4'>
          <Button>Default Button</Button>
          <Button variant='secondary'>Secondary</Button>
          <Button variant='outline'>Outline</Button>
          <Button variant='ghost'>Ghost</Button>
          <Button variant='link'>Link</Button>
          <Button variant='destructive'>Destructive</Button>
        </div>
      </div>

      {/* Form Components */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-foreground font-heading'>
          Form Components
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' placeholder='Enter your email' />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='name'>Full Name</Label>
            <Input id='name' placeholder='Enter your name' />
          </div>
        </div>
      </div>

      {/* Cards and Badges */}
      <div className='space-y-4'>
        <h3 className='text-lg font-semibold text-foreground font-heading'>
          Cards & Badges
        </h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Card>
            <CardHeader>
              <CardTitle>Themed Card</CardTitle>
              <CardDescription>
                This card adapts to the current tenant theme automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className='text-foreground mb-3'>
                shadcn/ui components automatically use your theme colors through
                CSS variables.
              </p>
              <div className='flex gap-2'>
                <Badge>Primary Badge</Badge>
                <Badge variant='secondary'>Secondary</Badge>
                <Badge variant='outline'>Outline</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className='text-primary'>Contact Form</CardTitle>
              <CardDescription>
                See how form elements look with your theme.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label htmlFor='message'>Message</Label>
                <Input id='message' placeholder='How can we help?' />
              </div>
              <Button className='w-full'>Send Message</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CSS Custom Properties Display */}
      <Card>
        <CardHeader>
          <CardTitle>CSS Custom Properties</CardTitle>
          <CardDescription>
            Current theme values being used by shadcn/ui components
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2 text-sm font-mono'>
            <div>
              --primary:{' '}
              <span className='text-primary'>{appliedTheme.primary}</span>
            </div>
            <div>
              --secondary:{' '}
              <span className='text-secondary'>{appliedTheme.secondary}</span>
            </div>
            <div>
              --background:{' '}
              <span style={{ color: '#000' }}>{appliedTheme.background}</span>
            </div>
            <div>
              --foreground:{' '}
              <span className='text-foreground'>{appliedTheme.text}</span>
            </div>
            <div className='md:col-span-2'>
              <Badge variant='outline' className='text-xs'>
                ✨ All shadcn/ui components automatically use these values
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Validation */}
      {showValidation && (
        <Card
          className={
            isValid
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }
        >
          <CardHeader>
            <CardTitle className={isValid ? 'text-green-800' : 'text-red-800'}>
              Theme Validation Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isValid ? (
              <p className='text-green-700'>✅ All theme colors are valid</p>
            ) : (
              <div className='text-red-700'>
                <p className='mb-2'>❌ Theme validation errors:</p>
                <ul className='list-disc list-inside space-y-1'>
                  {errors.map((error, index) => (
                    <li key={index} className='text-sm'>
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
