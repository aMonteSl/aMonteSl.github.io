import React, { useEffect } from 'react'
import { SEOHead } from './SEOHead'
import { Header } from './Header'
import { Footer } from '@/components/sections/Footer'
import { trackPageView } from '@/lib/analytics'

interface RootLayoutProps {
  children: React.ReactNode
}

export function RootLayout({ children }: RootLayoutProps) {
  useEffect(() => {
    // Track page views
    trackPageView()
  }, [])

  return (
    <>
      <SEOHead />
      <div className="min-h-screen bg-bg text-ink">
        {/* Skip to content link for accessibility */}
        <a
          href="#home"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-bg focus:rounded-lg focus:font-medium"
        >
          Skip to main content
        </a>
        
        <Header />
        
        <main className="relative">
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  )
}
