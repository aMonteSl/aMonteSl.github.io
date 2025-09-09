import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { SectionHeader } from '../ui/SectionHeader';
import { Card } from '../ui/Card';
import { gallery } from '../../data/gallery';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

export function ImagesSection() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const showPrev = useCallback(() => setLightboxIndex(i => (i === null ? null : (i - 1 + gallery.length) % gallery.length)), []);
  const showNext = useCallback(() => setLightboxIndex(i => (i === null ? null : (i + 1) % gallery.length)), []);

  // Keyboard navigation for lightbox
  React.useEffect(() => {
    if (lightboxIndex === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') showPrev();
      if (e.key === 'ArrowRight') showNext();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIndex, closeLightbox, showPrev, showNext]);

  return (
    <section id="images" className="py-section-y px-section-x container-responsive">
      <div className="max-w-content mx-auto">
        <SectionHeader title="Images" subtitle="Gallery & screenshots" />

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="cards-grid"
        >
          {gallery.map((item, idx) => (
            <Card key={item.src} className="overflow-hidden">
              <button
                onClick={() => openLightbox(idx)}
                className="w-full text-left"
                aria-label={`Open image ${item.alt}`}
              >
                <picture>
                  {item.sources?.map(s => (
                    <source key={s.src} srcSet={s.src} type={s.type} media={`(min-width: ${s.width}px)`} />
                  ))}
                  <img
                    src={item.src}
                    width={item.width}
                    height={item.height}
                    loading="lazy"
                    decoding="async"
                    alt={item.alt}
                    className="w-full h-auto block object-cover"
                  />
                </picture>
                {item.caption && <div className="p-3 text-sm text-muted">{item.caption}</div>}
              </button>
            </Card>
          ))}
        </motion.div>

        {/* Minimal Lightbox */}
        {lightboxIndex !== null && (
          <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={closeLightbox}
          >
            <div className="max-w-4xl w-full">
              <div className="relative">
                <button
                  onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
                  className="absolute top-3 right-3 z-20 p-2 rounded bg-surface-1/80 text-accent"
                  aria-label="Close"
                >
                  ✕
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); showPrev(); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded bg-surface-1/80 text-accent"
                  aria-label="Previous"
                >
                  ‹
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); showNext(); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded bg-surface-1/80 text-accent"
                  aria-label="Next"
                >
                  ›
                </button>
                <img
                  src={gallery[lightboxIndex].src}
                  alt={gallery[lightboxIndex].alt}
                  width={gallery[lightboxIndex].width}
                  height={gallery[lightboxIndex].height}
                  className="w-full h-auto rounded shadow-xl mx-auto"
                />
                {gallery[lightboxIndex].caption && (
                  <div className="mt-3 text-center text-muted">{gallery[lightboxIndex].caption}</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
