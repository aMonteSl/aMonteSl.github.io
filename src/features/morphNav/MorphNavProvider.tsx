'use client'

import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { LayoutGroup } from 'framer-motion'
import { useScrollProgress } from '@/features/morphNav/useScrollProgress'
import { SIDEBAR_MEDIA_QUERY } from '@/features/morphNav/layout'
import { NAV_ITEMS } from '@/lib/constants'

/** Scroll positions (px) where the header starts handing over to the sidebar and where it is done */
export interface MorphRange {
  start: number
  end: number
}

interface MorphNavContextValue {
  /** Scroll progress from 0 (header) to 1 (sidebar) */
  progress: number
  /** Scroll range of the morph; the desktop sidebar fades in over the same range */
  morphRange: MorphRange
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
  /** Whether the mobile/tablet navigation drawer is open (below the `xl` sidebar breakpoint) */
  isDrawerOpen: boolean
  /** Open the navigation drawer */
  openDrawer: () => void
  /** Close the navigation drawer */
  closeDrawer: () => void
  /** Toggle the navigation drawer */
  toggleDrawer: () => void
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
  // From xl the hero spans the viewport (the sidebar is hidden while it is on screen), so the header only
  // hands over to the sidebar once the hero is almost gone; otherwise the sidebar would cover its left column.
  // Below xl the fixed props drive the header fade and the floating menu button.
  const [desktopRange, setDesktopRange] = useState<MorphRange | null>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia(SIDEBAR_MEDIA_QUERY)
    const hero = document.getElementById('home')

    const measure = () => {
      if (!mediaQuery.matches || !hero) {
        setDesktopRange(null)
        return
      }

      // Done when the hero's bottom edge reaches the 64px header; the crossfade covers the 30% of the
      // viewport before that, by which point the hero's left column has scrolled out of view.
      const heroBottom = hero.offsetTop + hero.offsetHeight
      const end = Math.max(morphEnd, Math.round(heroBottom - 64))
      const start = Math.max(morphStart, Math.round(end - Math.max(200, window.innerHeight * 0.3)))

      setDesktopRange((current) => (
        current?.start === start && current.end === end ? current : { start, end }
      ))
    }

    measure()
    const resizeObserver = new ResizeObserver(measure)
    if (hero) resizeObserver.observe(hero)
    window.addEventListener('resize', measure)
    mediaQuery.addEventListener('change', measure)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', measure)
      mediaQuery.removeEventListener('change', measure)
    }
  }, [morphStart, morphEnd])

  const morphRange: MorphRange = desktopRange ?? { start: morphStart, end: morphEnd }
  const { progress, isMorphed, isMorphing, prefersReducedMotion } = useScrollProgress(morphRange)

  const [activeSection, setActiveSection] = useState('home')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])
  const toggleDrawer = useCallback(() => setIsDrawerOpen((open) => !open), [])

  // The drawer only exists below the sidebar breakpoint: close it as soon as the
  // fixed sidebar takes over, so a resize never leaves the body scroll-locked.
  useEffect(() => {
    const mediaQuery = window.matchMedia(SIDEBAR_MEDIA_QUERY)

    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsDrawerOpen(false)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

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
      // Matches `scroll-padding-top: 5rem` in globals.css so anchor and button navigation land alike.
      const headerOffset = 80
      const targetTop = element.getBoundingClientRect().top + window.scrollY - headerOffset

      window.scrollTo({
        top: Math.max(targetTop, 0),
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      })
    }
  }

  const contextValue: MorphNavContextValue = {
    progress,
    morphRange,
    isMorphed,
    isMorphing,
    activeSection,
    prefersReducedMotion,
    scrollToSection,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
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
