'use client'

import { motion } from 'framer-motion'
import { Hero, AnimatedBackground } from '@/features/landing'
import { ProfileSection } from '@/features/profile'
import { FeaturedProjectsSection } from '@/features/projects'
import { ParallelStreamsSection } from '@/features/journey'
import { SkillsSection } from '@/features/skills'
import { MorphNavProvider, MorphHeader, MorphSidebar, useMorphNav } from '@/features/morphNav'

function HomeContent() {
  const { progress } = useMorphNav()
  const lineScale = Math.min(progress / 0.85, 1)

  return (
    <>
      <AnimatedBackground />

      {/* Morphing navigation system */}
      <MorphHeader />
      <MorphSidebar />

      {/* Sidebar boundary line that grows on scroll */}
      <motion.div
        className="hidden lg:block fixed top-0 left-64 z-20 w-px h-screen bg-[var(--border)]/40 origin-top pointer-events-none"
        style={{ scaleY: lineScale, opacity: lineScale > 0 ? 1 : 0 }}
        aria-hidden="true"
      />

      {/* Main content with sidebar offset on desktop */}
      <div className="lg:ml-64 lg:pl-6 xl:pl-8 transition-[margin] duration-300">
        {/* Hero section */}
        <Hero />

        {/* Profile section - About Me */}
        <ProfileSection />

        {/* Featured Projects section */}
        <FeaturedProjectsSection />

        {/* Skills section */}
        <SkillsSection />

        {/* Professional Journey section */}
        <ParallelStreamsSection />
      </div>
    </>
  )
}

export default function Home() {
  return (
    <MorphNavProvider morphStart={100} morphEnd={450}>
      <HomeContent />
    </MorphNavProvider>
  )
}
