'use client'

import { useState, useEffect, useCallback } from 'react'

export interface UseScrollGuardReturn {
  showModal: boolean
  closeModal: () => void
}

export function useScrollGuard(): UseScrollGuardReturn {
  const [showModal, setShowModal] = useState(false)

  const handleWheelEvent = useCallback((e: WheelEvent) => {
    // Only detect scroll down
    if (e.deltaY > 0) {
      e.preventDefault()
      e.stopPropagation()
      setShowModal(true)
    }
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't block Tab navigation for accessibility
    if (e.key === 'Tab') return

    // Detect keys that would normally navigate down
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'End' ||
        (e.key === ' ' && !e.shiftKey)) {
      e.preventDefault()
      e.stopPropagation()
      setShowModal(true)
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Prevent scroll on touch devices
    if (e.touches.length === 1) {
      e.preventDefault()
      e.stopPropagation()
      setShowModal(true)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('wheel', handleWheelEvent, { passive: false })
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      document.removeEventListener('wheel', handleWheelEvent)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handleWheelEvent, handleKeyDown, handleTouchMove])

  const closeModal = useCallback(() => {
    setShowModal(false)
  }, [])

  return {
    showModal,
    closeModal
  }
}
