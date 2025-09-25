/**
 * Client Date Component
 * Client-side only date formatting to avoid hydration issues
 */

import { useState, useEffect } from 'react'

interface ClientDateProps {
  dateString: string
}

export function ClientDate({ dateString }: ClientDateProps) {
  const [formattedDate, setFormattedDate] = useState<string>('')

  useEffect(() => {
    const date = new Date(dateString)
    setFormattedDate(date.toLocaleDateString())
  }, [dateString])

  return <span>{formattedDate}</span>
}
