'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { LayoutGroup } from 'framer-motion'
import { useScrollProgress } from '@/features/morphNav/useScrollProgress'
import { NAV_ITEMS } from '@/lib/constants'

interface MorphNavContextValue {
  /** Scroll progress from 0 (header) to 1 (sidebar) */
  progress: number
  /** Whether sidebar is fully visible */
  isMorphed: boolean
  /** Whether currently transitioning */
  isMorphing: boolean
  /** Active section ID based on scroll position */
  activeSection: string
  /** User prefers reduced motion */
  prefersReducedMotion: boolean
  /** Scroll to a section by ID */
  scrollToSection: (sectionId: string) => void
}

const MorphNavContext = createContext<MorphNavContextValue | null>(null)

interface MorphNavProviderProps {
  children: ReactNode
  /** Scroll position where morph starts */
  morphStart?: number
  /** Scroll position where morph completes */
  morphEnd?: number
}

export function MorphNavProvider({
  children,
  morphStart = 100,
  morphEnd = 400,
}: MorphNavProviderProps) {
  const { progress, isMorphed, isMorphing, prefersReducedMotion } = useScrollProgress({
    start: morphStart,
    end: morphEnd,
  })

  const [activeSection, setActiveSection] = useState('home')

  // Scrollspy: track active section
  useEffect(() => {
    const sectionIds = NAV_ITEMS.map(item => item.href.replace('#', ''))

    const observer = new IntersectionObserver(
      (entries) => {
        // Find all intersecting entries and pick the one with the highest intersection ratio
        const intersectingEntries = entries.filter(entry => entry.isIntersecting)
        
        if (intersectingEntries.length > 0) {
          // Sort by intersection ratio (descending) to get the most visible section
          const mostVisible = intersectingEntries.sort(
            (a, b) => b.intersectionRatio - a.intersectionRatio
          )[0]
          
          setActiveSection(mostVisible.target.id)
        }
      },
      {
        // Use simple threshold - section is "active" when any part is visible in viewport
        threshold: [0, 0.25, 0.5, 0.75, 1],
        // Only detect sections when they're in the upper 60% of the viewport
        rootMargin: '0px 0px -40% 0px',
      }
    )

    // Observe all sections
    sectionIds.forEach(id => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  // Scroll to section handler
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const contextValue: MorphNavContextValue = {
    progress,
    isMorphed,
    isMorphing,
    activeSection,
    prefersReducedMotion,
    scrollToSection,
  }

  return (
    <MorphNavContext.Provider value={contextValue}>
      <LayoutGroup>
        {children}
      </LayoutGroup>
    </MorphNavContext.Provider>
  )
}

/**
 * Access the morph navigation context
 * @throws if used outside MorphNavProvider
 */
export function useMorphNav(): MorphNavContextValue {
  const context = useContext(MorphNavContext)
  if (!context) {
    throw new Error('useMorphNav must be used within a MorphNavProvider')
  }
  return context
}
