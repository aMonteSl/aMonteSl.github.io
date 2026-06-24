'use client'

import { Hero, AnimatedBackground } from '@/features/landing'
import { ProfileSection, ScrollCue } from '@/features/profile'
import { FeaturedProjectsSection } from '@/features/projects'
import { ParallelStreamsSection } from '@/features/journey'
import { SkillsSection } from '@/features/skills'
import { TestimonialsSection } from '@/features/testimonials'
import { CertificationsSection } from '@/features/certifications'
import { ContactCTASection } from '@/features/contact'
import { MorphNavProvider, MorphHeader, MorphSidebar } from '@/features/morphNav'

function HomeContent() {
  return (
    <>
      <AnimatedBackground />

      <MorphHeader />
      <MorphSidebar />

      <div className="lg:ml-[17rem] lg:pl-6 xl:pl-8 transition-[margin] duration-300">
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
