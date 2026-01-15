'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useTranslations } from '@/i18n'
import { NAV_ITEMS } from '@/lib/constants'

export function Nav() {
  const t = useTranslations('nav')
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries.filter(entry => entry.isIntersecting)

        if (visibleSections.length > 0) {
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

    NAV_ITEMS.forEach(({ href }) => {
      const element = document.querySelector(href)
      if (element) observer.observe(element)
    })

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const element = document.querySelector(NAV_ITEMS[i].href) as HTMLElement
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(element.id)
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <nav className="flex items-center gap-1" role="navigation" aria-label="Main navigation">
      {NAV_ITEMS.map(({ key, href }) => {
        const sectionId = href.replace('#', '')
        const isActive = activeSection === sectionId

        return (
          <Link
            key={key}
            href={href}
            className={cn(
              'relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200',
              'after:absolute after:bottom-0.5 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:rounded-full after:bg-[var(--accent)] after:transition-all after:duration-200',
              isActive
                ? 'text-[var(--fg)] after:w-4 after:opacity-100'
                : 'text-[var(--fg-muted)] after:w-0 after:opacity-0 hover:text-[var(--fg)] hover:bg-[var(--card)]/30'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {t(key)}
          </Link>
        )
      })}
    </nav>
  )
}
