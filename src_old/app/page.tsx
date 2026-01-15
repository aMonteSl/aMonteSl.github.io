'use client'

import { Hero } from './_components/Hero'
import AnimatedBackground from './_components/AnimatedBackground'
import { DevelopmentModal } from './_components/DevelopmentModal'
import { useScrollGuard } from './_components/useScrollGuard'

export default function Home() {
  const { showModal, closeModal } = useScrollGuard()

  return (
    <>
      <AnimatedBackground />
      
      {/* Landing page only - durante desarrollo */}
      <div className="min-h-screen">
        <Hero />
      </div>
      
      {/* Modal de desarrollo */}
      <DevelopmentModal isOpen={showModal} onClose={closeModal} />
    </>
  )
}
