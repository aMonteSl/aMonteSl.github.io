import React from 'react'
import { RootLayout } from './layout/RootLayout'
import { HeroSection } from './components/sections/HeroSection'
import { ProjectsSection } from './components/sections/ProjectsSection'
import { EducationSection } from './components/sections/EducationSection'
import { ActivitiesSection } from './components/sections/ActivitiesSection'
import { SkillsSection } from './components/sections/SkillsSection'
import { LanguagesSection } from './components/sections/LanguagesSection'
import { ImagesSection } from './components/sections/ImagesSection'
import { ContactSection } from './components/sections/ContactSection'
import { ResumeSection } from './components/sections/ResumeSection'

function App() {
  return (
    <RootLayout>
      <HeroSection />
      <ProjectsSection />
      <EducationSection />
      <ActivitiesSection />
      <SkillsSection />
      <LanguagesSection />
      <ImagesSection />
      <ContactSection />
      <ResumeSection />
    </RootLayout>
  )
}

export default App
