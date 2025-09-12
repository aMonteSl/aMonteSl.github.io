'use client'

import { useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface SlideDotsProps {
  ids: string[]
}

export default function SlideDots({ ids }: SlideDotsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleDotClick = useCallback((id: string, index: number) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveIndex(index)
    }
  }, [])

  useEffect(() => {
    // Create intersection observer to track which section is active
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            const sectionId = entry.target.id
            const index = ids.indexOf(sectionId)
            if (index !== -1) {
              setActiveIndex(index)
            }
          }
        })
      },
      {
        threshold: [0.6],
        rootMargin: '-10% 0px -10% 0px'
      }
    )

    // Observe all sections
    ids.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [ids])

  // Custom hook to track active section for external use
  useEffect(() => {
    // Dispatch custom event when active section changes
    window.dispatchEvent(new CustomEvent('activeSectionChange', {
      detail: { activeIndex, sectionId: ids[activeIndex] }
    }))
  }, [activeIndex, ids])

  return (
    <nav 
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-3"
      role="navigation"
      aria-label="Section navigation"
    >
      {ids.map((id, index) => (
        <button
          key={id}
          onClick={() => handleDotClick(id, index)}
          className={cn(
            "w-3 h-3 rounded-full transition-all duration-200 border-2",
            "hover:scale-110 focus-visible:scale-110",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
            activeIndex === index
              ? "bg-accent border-accent shadow-lg shadow-accent/20"
              : "bg-transparent border-slate-400 hover:border-accent"
          )}
          aria-label={`Go to ${id.charAt(0).toUpperCase() + id.slice(1)} section`}
          aria-current={activeIndex === index ? 'true' : undefined}
          tabIndex={0}
        />
      ))}
    </nav>
  )
}
