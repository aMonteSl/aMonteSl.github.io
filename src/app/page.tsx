'use client'

import { Hero } from './_components/Hero'
import AnimatedBackground from './_components/AnimatedBackground'

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      
      {/* Content wrapper with proper z-index */}
      <div className="relative z-10">
        {/* Hero Section with Animations */}
        <Hero />
      </div>
    </>
  )
}
