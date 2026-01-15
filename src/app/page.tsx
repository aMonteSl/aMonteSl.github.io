'use client'

import { Hero, AnimatedBackground } from '@/features/landing'
import { FeaturedProjectsSection } from '@/features/projects'
import { ProfessionalJourneySection } from '@/features/journey'

export default function Home() {
  return (
    <>
      <AnimatedBackground />

      {/* Hero section */}
      <Hero />

      {/* Featured Projects section */}
      <FeaturedProjectsSection />

      {/* Professional Journey section */}
      <ProfessionalJourneySection />
    </>
  )
}
