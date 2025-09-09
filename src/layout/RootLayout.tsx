import React, { useEffect } from 'react'
import { SEOHead } from './SEOHead'
import { Header } from './Header'
import { Footer } from '../components/sections/Footer'
import AnimatedBackground from '../components/background/AnimatedBackground'
import { trackPageView } from '../lib/analytics'

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
      {/* Global animated background - covers entire site */}
      <AnimatedBackground />
      
      <div className="min-h-screen text-ink relative z-10">
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
