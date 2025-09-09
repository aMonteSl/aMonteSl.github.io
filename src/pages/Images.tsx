import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { gallery } from '@/data/gallery'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery'

export default function ImagesPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const lightboxSlides = gallery.map(item => ({
    src: item.src,
    alt: item.alt,
    width: item.width,
    height: item.height
  }))

  return (
    <div className="min-h-screen section-padding">
      <div className="container-custom">
        <SectionHeader
          title="Images & Portfolio"
          description="Visual showcase of projects, achievements, and professional journey"
          centered={true}
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 mt-8"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, delay: 0.2 }}
        >
          {gallery.map((item, index) => (
            <motion.div
              key={item.id}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.4, delay: index * 0.1 }}
              whileHover={prefersReducedMotion ? {} : { y: -4 }}
            >
              <Card className="group cursor-pointer overflow-hidden" onClick={() => openLightbox(index)}>
                <div className="aspect-[3/2] overflow-hidden">
                  <img
                    src={item.src}
                    alt={item.alt}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  {item.category && (
                    <Badge variant="secondary" className="mb-2">
                      {item.category}
                    </Badge>
                  )}
                  {item.caption && (
                    <p className="text-sm text-muted leading-relaxed">
                      {item.caption}
                    </p>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={lightboxSlides}
        animation={{ fade: prefersReducedMotion ? 0 : 250 }}
        carousel={{ finite: true }}
        toolbar={{
          buttons: ['close']
        }}
      />
    </div>
  )
}
