'use client'

import { PropsWithChildren, useEffect, useCallback, useRef } from 'react'

interface FullpageProviderProps {
  ids: string[]
}

export default function FullpageProvider({ 
  children, 
  ids 
}: PropsWithChildren<FullpageProviderProps>) {
  
  const wheelThrottleRef = useRef(false)
  
  const nextSection = useCallback(() => {
    const main = document.querySelector('main.fullpage')
    if (!main) return
    
    const currentScrollTop = main.scrollTop
    const viewportHeight = main.clientHeight
    const currentIndex = Math.round(currentScrollTop / viewportHeight)
    const nextIndex = Math.min(currentIndex + 1, ids.length - 1)
    
    if (nextIndex > currentIndex) {
      const targetElement = document.getElementById(ids[nextIndex])
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [ids])

  const prevSection = useCallback(() => {
    const main = document.querySelector('main.fullpage')
    if (!main) return
    
    const currentScrollTop = main.scrollTop
    const viewportHeight = main.clientHeight
    const currentIndex = Math.round(currentScrollTop / viewportHeight)
    const prevIndex = Math.max(currentIndex - 1, 0)
    
    if (prevIndex < currentIndex) {
      const targetElement = document.getElementById(ids[prevIndex])
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [ids])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Don't interfere if user is typing in an input or textarea
    const activeElement = document.activeElement
    if (activeElement && (
      activeElement.tagName === 'INPUT' || 
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.getAttribute('contenteditable') === 'true'
    )) {
      return
    }

    // Don't interfere if event was already handled
    if (event.defaultPrevented) return

    switch (event.key) {
      case 'ArrowDown':
      case 'PageDown':
        event.preventDefault()
        nextSection()
        break
      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault()
        prevSection()
        break
    }
  }, [nextSection, prevSection])

  const handleWheel = useCallback((event: WheelEvent) => {
    // Don't interfere if event was already handled
    if (event.defaultPrevented) return
    
    // Simple throttle to prevent multiple rapid scrolls
    if (wheelThrottleRef.current) return
    
    const deltaY = event.deltaY
    if (Math.abs(deltaY) < 50) return // Ignore small movements
    
    wheelThrottleRef.current = true
    setTimeout(() => {
      wheelThrottleRef.current = false
    }, 500)
    
    // Let scroll-snap handle the actual scrolling
    // We just add a small delay to ensure smooth behavior
  }, [])

  useEffect(() => {
    // Activate fullpage mode
    document.documentElement.classList.add('fullpage')
    document.body.classList.add('fullpage')

    // Add keyboard and wheel listeners
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('wheel', handleWheel, { passive: true })

    // Cleanup on unmount
    return () => {
      document.documentElement.classList.remove('fullpage')
      document.body.classList.remove('fullpage')
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('wheel', handleWheel)
    }
  }, [handleKeyDown, handleWheel])

  return (
    <main className="fullpage">
      {children}
    </main>
  )
}
