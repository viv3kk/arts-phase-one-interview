'use client'

import { useId } from 'react'
import { OTPInput, SlotProps } from 'input-otp'
import { cn } from '@/lib/utils'

interface OTPInputComponentProps {
  value: string
  onChange: (value: string) => void
  maxLength?: number
}

export default function OTPInputComponent({
  value,
  onChange,
  maxLength = 6,
}: OTPInputComponentProps) {
  const id = useId()

  return (
    <div className='flex justify-center w-full py-4'>
      <OTPInput
        id={id}
        value={value}
        onChange={onChange}
        containerClassName='flex items-center gap-1 has-disabled:opacity-50'
        maxLength={maxLength}
        autoFocus
        render={({ slots }) => (
          <div className='flex gap-2'>
            {slots.map((slot, idx) => (
              <Slot key={idx} {...slot} />
            ))}
          </div>
        )}
      />
    </div>
  )
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        'relative flex h-14 w-12 items-center justify-center border-2 bg-background text-black font-semibold text-xl rounded-lg transition-all duration-200',
        {
          'border-black ring-0.5 ring-none': props.isActive,
          'border-black bg-gray-50': props.char !== null,
          'border-gray-200 hover:border-border':
            props.char === null && !props.isActive,
        },
      )}
    >
      {props.char !== null && (
        <span className='text-foreground'>{props.char}</span>
      )}
      {props.char === null && props.isActive && (
        <div className='w-2 h-0.5 bg-gray-500 animate-pulse'></div>
      )}
    </div>
  )
}
