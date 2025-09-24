'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

interface DateTimePickerProps {
  label: string
  date: Date | undefined
  time?: string | undefined
  onSelect: (date: Date | undefined, time: string | undefined) => void
  minDate?: Date
  className?: string
}

export function DateTimePicker({
  label,
  date,
  time,
  onSelect,
  minDate,
  className,
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(date)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(time)
  const [open, setOpen] = useState(false)

  // Update internal state when props change
  useEffect(() => {
    setSelectedDate(date)
    if (time !== undefined) {
      setSelectedTime(time)
    }
  }, [date, time])

  // Mock time slots data - in real app, this could be dynamic based on availability
  const timeSlots = [
    '00:00',
    '00:30',
    '01:00',
    '01:30',
    '02:00',
    '02:30',
    '03:00',
    '03:30',
    '04:00',
    '04:30',
    '05:00',
    '05:30',
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    '22:30',
    '23:00',
    '23:30',
  ]

  const handleDateSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate)
    onSelect(newDate, selectedTime)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
    onSelect(selectedDate, time)
    setOpen(false)
  }

  const formatSelectedDateTime = () => {
    if (!selectedDate) return ''
    const dateStr = format(selectedDate, 'MMM dd, yyyy')
    return selectedTime ? `${dateStr} at ${selectedTime}` : dateStr
  }

  const displayText = formatSelectedDateTime()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn(
            'w-full justify-between text-left font-normal',
            !date && 'text-muted-foreground',
            className,
          )}
        >
          <div className='flex items-center min-w-0 flex-1'>
            <span className='mr-2 text-xs font-medium text-gray-500 flex-shrink-0'>
              {label}:
            </span>
            <span
              className={cn(
                'truncate text-sm',
                !displayText && 'text-muted-foreground',
              )}
            >
              {displayText || 'Select date & time'}
            </span>
          </div>
          <div className='flex items-center space-x-1'>
            <CalendarIcon className='h-4 w-4 flex-shrink-0' />
            <Clock className='h-4 w-4 flex-shrink-0' />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <div className='rounded-md border'>
          <div className='flex max-sm:flex-col'>
            <Calendar
              mode='single'
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={minDate ? [{ before: minDate }] : undefined}
              className='p-2 sm:pe-5'
            />
            <div className='relative w-full max-sm:h-48 sm:w-40'>
              <div className='absolute inset-0 py-4 max-sm:border-t'>
                <ScrollArea className='h-full sm:border-s'>
                  <div className='space-y-3'>
                    <div className='flex h-5 shrink-0 items-center px-5'>
                      <p className='text-sm font-medium'>
                        {selectedDate
                          ? format(selectedDate, 'EEEE, d')
                          : 'Select time'}
                      </p>
                    </div>
                    <div className='grid gap-1.5 px-5 max-sm:grid-cols-2'>
                      {timeSlots.map(time => (
                        <Button
                          key={time}
                          variant={
                            selectedTime === time ? 'default' : 'outline'
                          }
                          size='sm'
                          className='w-full'
                          onClick={() => handleTimeSelect(time)}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
