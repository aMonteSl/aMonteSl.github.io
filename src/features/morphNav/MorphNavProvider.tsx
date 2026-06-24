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

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map(item => item.href.replace('#', ''))
    let frameId = 0

    const getSectionElements = () =>
      sectionIds
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => Boolean(element))

    const updateActiveSection = () => {
      frameId = 0

      const sections = getSectionElements()
      if (sections.length === 0) return

      const scrollPosition = window.scrollY
      const viewportHeight = window.innerHeight
      const activationLine = scrollPosition + Math.min(viewportHeight * 0.38, 360)
      const documentBottom = scrollPosition + viewportHeight >= document.documentElement.scrollHeight - 2

      if (documentBottom) {
        setActiveSection(sections[sections.length - 1].id)
        return
      }

      let nextActive = sections[0].id

      for (const section of sections) {
        const sectionTop = section.offsetTop

        if (sectionTop <= activationLine) {
          nextActive = section.id
        } else {
          break
        }
      }

      setActiveSection((current) => (current === nextActive ? current : nextActive))
    }

    const requestUpdate = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateActiveSection)
    }

    updateActiveSection()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 76
      const targetTop = element.getBoundingClientRect().top + window.scrollY - headerOffset

      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
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
