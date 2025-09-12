'use client'

import { Hero } from './_components/Hero'
import { Projects } from './_components/Projects'
import AnimatedBackground from './_components/AnimatedBackground'
import FullpageProvider from './_components/FullpageProvider'
import FullpageSection from './_components/FullpageSection'
import SlideDots from './_components/SlideDots'

const SECTIONS = ['home', 'projects']

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      
      {/* Fullpage slide system */}
      <FullpageProvider ids={SECTIONS}>
        <FullpageSection id="home">
          <Hero />
        </FullpageSection>
        
        <FullpageSection id="projects">
          <section className="mx-auto px-6 section-y">
            <div className="mx-auto content-width">
              <Projects />
            </div>
          </section>
        </FullpageSection>
        
        {/* Future sections can be added here:
        <FullpageSection id="about">
          <About />
        </FullpageSection>
        <FullpageSection id="skills">
          <Skills />
        </FullpageSection>
        */}
      </FullpageProvider>
      
      {/* Slide navigation dots */}
      <SlideDots ids={SECTIONS} />
    </>
  )
}
