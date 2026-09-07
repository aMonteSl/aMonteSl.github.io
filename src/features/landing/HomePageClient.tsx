'use client'

import { Hero, AnimatedBackground } from '@/features/landing'
import { ProfileSection, ScrollCue } from '@/features/profile'
import { FeaturedProjectsSection } from '@/features/projects'
import { ParallelStreamsSection } from '@/features/journey'
import { SkillsSection } from '@/features/skills'
import { TestimonialsSection } from '@/features/testimonials'
import { CertificationsSection } from '@/features/certifications'
import { ContactCTASection } from '@/features/contact'
import {
  MorphNavProvider,
  MorphHeader,
  MorphSidebar,
  SIDEBAR_CONTENT_OFFSET_CLASS,
} from '@/features/morphNav'
import { cn } from '@/lib/utils'

function HomeContent() {
  return (
    <>
      <AnimatedBackground />

      <MorphHeader />
      <MorphSidebar />

      {/* Makes room for the fixed sidebar from xl; below that the content spans the viewport */}
      <div className={cn(SIDEBAR_CONTENT_OFFSET_CLASS)}>
        <Hero />
        <ScrollCue />
        <ProfileSection />
        <FeaturedProjectsSection />
        <SkillsSection />
        <ParallelStreamsSection />
        <TestimonialsSection />
        <CertificationsSection />
        <ContactCTASection />
      </div>
    </>
  )
}

export function HomePageClient() {
  return (
    <MorphNavProvider morphStart={100} morphEnd={450}>
      <HomeContent />
    </MorphNavProvider>
  )
}
