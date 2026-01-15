'use client'

import { Hero, AnimatedBackground } from '@/features/landing'
import { DevelopmentModal, useScrollGuard } from '@/features/constructionNotice'

export default function Home() {
  const { showModal, closeModal } = useScrollGuard()

  return (
    <>
      <AnimatedBackground />

      {/* Landing page only - during development */}
      <div className="min-h-screen">
        <Hero />
      </div>

      {/* Development modal */}
      <DevelopmentModal isOpen={showModal} onClose={closeModal} />
    </>
  )
}
