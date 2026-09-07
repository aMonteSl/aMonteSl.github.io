import type { Metadata } from 'next'
import { JsonLd, LocalizedShell } from '@/components/common'
import { HomePageClient } from '@/features/landing'
import { SIDEBAR_CONTENT_OFFSET_CLASS } from '@/features/morphNav/layout'
import { buildHomeJsonLd, buildHomeMetadata } from '@/lib/seo'

export const metadata: Metadata = buildHomeMetadata('es')

export default function SpanishHome() {
  return (
    <LocalizedShell locale="es" footerClassName={SIDEBAR_CONTENT_OFFSET_CLASS}>
      <JsonLd data={buildHomeJsonLd('es')} />
      <HomePageClient />
    </LocalizedShell>
  )
}
