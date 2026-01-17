'use client'

import { Hero, AnimatedBackground } from '@/features/landing'
import { FeaturedProjectsSection } from '@/features/projects'
import { ProfessionalJourneySection } from '@/features/journey'
import { SkillsSection } from '@/features/skills'
import { MorphNavProvider, MorphHeader, MorphSidebar } from '@/features/morphNav'

export default function Home() {
  return (
    <MorphNavProvider morphStart={100} morphEnd={450}>
      <AnimatedBackground />

      {/* Morphing navigation system */}
      <MorphHeader />
      <MorphSidebar />

      {/* Main content with sidebar offset on desktop */}
      <div className="lg:ml-64 lg:pl-6 xl:pl-8 lg:border-l lg:border-[var(--border)]/40 transition-[margin] duration-300">
        {/* Hero section */}
        <Hero />

        {/* Featured Projects section */}
        <FeaturedProjectsSection />

        {/* Skills section */}
        <SkillsSection />

        {/* Professional Journey section */}
        <ProfessionalJourneySection />
      </div>
    </MorphNavProvider>
  )
}
