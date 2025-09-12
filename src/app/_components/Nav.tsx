'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useI18n } from '../_i18n/I18nProvider'

const navigation = [
  { nameKey: 'home', href: '#home' },
]

export function Nav() {
  const { t } = useI18n()
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Filtra las entradas que están intersecando y encuentra la con mayor ratio de intersección
        const visibleSections = entries.filter(entry => entry.isIntersecting)
        
        if (visibleSections.length > 0) {
          // Ordena por ratio de intersección y toma la más visible
          const mostVisible = visibleSections.reduce((prev, current) => 
            current.intersectionRatio > prev.intersectionRatio ? current : prev
          )
          setActiveSection(mostVisible.target.id)
        }
      },
      { 
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: '-80px 0px -50% 0px'
      }
    )

    // Observa todas las secciones
    navigation.forEach(({ href }) => {
      const element = document.querySelector(href)
      if (element) observer.observe(element)
    })

    // También añade un listener de scroll como fallback
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100
      
      for (let i = navigation.length - 1; i >= 0; i--) {
        const element = document.querySelector(navigation[i].href) as HTMLElement
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(element.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Ejecuta inmediatamente para establecer la sección inicial

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav className="flex items-center space-x-1" role="navigation" aria-label="Navegación principal">
      {navigation.map(({ nameKey, href }) => {
        const sectionId = href.replace('#', '')
        const isActive = activeSection === sectionId
        
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "px-3 py-2 text-sm font-medium transition-all duration-200 rounded-lg",
              "hover:text-fg hover:bg-card/50",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
              isActive 
                ? "text-fg bg-card border-b-2 border-accent" 
                : "text-fg-muted"
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {t(`nav.${nameKey}`)}
          </Link>
        )
      })}
    </nav>
  )
}
