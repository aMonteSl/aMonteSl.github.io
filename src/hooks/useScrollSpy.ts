import { useState, useEffect } from 'react'
import { sectionIds } from '../data/nav'

export function useScrollSpy(offset = 120) {
  const [activeId, setActiveId] = useState<string>('home')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section that's most visible
        let mostVisible = { id: 'home', ratio: 0 }
        
        entries.forEach((entry) => {
          if (entry.intersectionRatio > mostVisible.ratio) {
            mostVisible = {
              id: entry.target.id,
              ratio: entry.intersectionRatio
            }
          }
        })

        // Only update if we have a significant intersection
        if (mostVisible.ratio > 0.1) {
          setActiveId(mostVisible.id)
          
          // Update URL hash without scrolling
          const newHash = `#${mostVisible.id}`
          if (window.location.hash !== newHash) {
            history.replaceState(null, '', newHash)
          }
        }
      },
      {
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
        rootMargin: `-${offset}px 0px -50% 0px`
      }
    )

    // Observe all sections
    const elements = sectionIds.map(id => document.getElementById(id)).filter(Boolean)
    elements.forEach(element => {
      if (element) observer.observe(element)
    })

    // Handle initial hash
    if (window.location.hash) {
      const hashId = window.location.hash.slice(1)
      if (sectionIds.includes(hashId)) {
        setActiveId(hashId)
      }
    }

    return () => observer.disconnect()
  }, [offset])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const headerHeight = offset
      const elementPosition = element.offsetTop - headerHeight
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      })
      
      // Update active state immediately for better UX
      setActiveId(id)
      history.pushState(null, '', `#${id}`)
    }
  }

  return { activeId, scrollToSection }
}
