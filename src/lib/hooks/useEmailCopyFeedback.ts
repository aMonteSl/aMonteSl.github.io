'use client'

import { useEffect, useRef, useState } from 'react'
import { LINKS } from '@/lib/constants'

export function useEmailCopyFeedback(timeoutMs = 1800) {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const emailAddress = LINKS.email.replace(/^mailto:/, '')

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }
    }
  }, [])

  const copyEmail = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        return
      }

      await navigator.clipboard.writeText(emailAddress)
      setCopiedEmail(true)

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current)
      }

      copyTimeoutRef.current = setTimeout(() => {
        setCopiedEmail(false)
      }, timeoutMs)
    } catch {
      // The mailto link remains the primary action when clipboard access is unavailable.
    }
  }

  return { copiedEmail, copyEmail, emailAddress }
}
