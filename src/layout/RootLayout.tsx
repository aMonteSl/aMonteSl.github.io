import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { SEOHead } from './SEOHead'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
import { trackPageView } from '@/lib/analytics'

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  const location = useLocation()

  useEffect(() => {
    // Track page views
    trackPageView()
    
    // Scroll to top on route change
    window.scrollTo(0, 0)
  }, [location])

  return (
    <>
      <SEOHead />
      <div className="min-h-screen bg-background text-text-primary">
        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="skip-link"
        >
          Skip to main content
        </a>
        
        <Navbar />
        
        <main id="main-content" className="flex-1">
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  )
}
