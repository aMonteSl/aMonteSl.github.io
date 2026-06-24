import type { Metadata } from 'next'
import { JsonLd, LocalizedShell } from '@/components/common'
import { HomePageClient } from '@/features/landing'
import { buildHomeJsonLd, buildHomeMetadata } from '@/lib/seo'

export const metadata: Metadata = buildHomeMetadata('es')

export default function SpanishHome() {
  return (
    <LocalizedShell locale="es">
      <JsonLd data={buildHomeJsonLd('es')} />
      <HomePageClient />
    </LocalizedShell>
  )
}
