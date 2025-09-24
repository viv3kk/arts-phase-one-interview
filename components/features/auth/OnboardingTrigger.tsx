/**
 * Login Button Component
 * Opens login modal and routes to dashboard on success
 */
'use client'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/providers/StoreProvider'
import { useRouter } from 'next/navigation'

export function OnboardingTrigger() {
  const { openLoginModal, isAuthenticated } = useAuth()
  const router = useRouter()
  const handleLogin = () => {
    openLoginModal(() => {
      router.push('/dashboard')
    })
  }

  const handleCompleteOnboardingSteps = () => {
    openLoginModal()
  }

  // Don't show login button if already authenticated
  // if (isAuthenticated) {
  //   return (
  //     <Card className='text-center'>
  //       <CardContent className='pt-6'>
  //         <p className='text-green-600 mb-4'>✅ You are already logged in!</p>
  //         <Button
  //           onClick={() => router.push('/dashboard')}
  //           variant='default'
  //           size='lg'
  //           className='bg-green-600 hover:bg-green-700'
  //         >
  //           Go to Dashboard
  //         </Button>
  //       </CardContent>
  //     </Card>
  //   )
  // }

  return (
    <div className='text-center space-y-4 flex-col gap-4 items-center hidden'>
      <Button
        onClick={handleLogin}
        variant='default'
        size='lg'
        className='px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all w-[200px]'
      >
        Login
      </Button>
      {isAuthenticated && (
        <Button
          onClick={() => router.push('/dashboard')}
          variant='default'
          size='lg'
          className='px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all bg-green-600 hover:bg-green-700 w-[200px]'
        >
          Go to Dashboard
        </Button>
      )}
      <Button
        variant='default'
        // size='lg'
        className='px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all bg-green-600 hover:bg-green-700'
        onClick={handleCompleteOnboardingSteps}
      >
        Complete Onboarding Steps
      </Button>
    </div>
  )
}
