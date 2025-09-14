'use client'

import { useState, useEffect, useCallback } from 'react'

export function useScrollGuard() {
  const [showModal, setShowModal] = useState(false)

  const handleWheelEvent = useCallback((e: WheelEvent) => {
    // Solo detectar scroll hacia abajo
    if (e.deltaY > 0) {
      e.preventDefault()
      e.stopPropagation()
      setShowModal(true)
    }
  }, [])

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Detectar teclas que normalmente navegarían hacia abajo
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === 'End' || 
        (e.key === ' ' && !e.shiftKey)) {
      e.preventDefault()
      e.stopPropagation()
      setShowModal(true)
    }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Prevenir scroll en dispositivos táctiles
    if (e.touches.length === 1) {
      e.preventDefault()
      e.stopPropagation()
      setShowModal(true)
    }
  }, [])

  useEffect(() => {
    // Prevenir scroll con wheel
    document.addEventListener('wheel', handleWheelEvent, { passive: false })
    
    // Prevenir navegación con teclado
    document.addEventListener('keydown', handleKeyDown)
    
    // Prevenir scroll táctil
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
