import type { Metadata } from 'next'
import { LocalizedShell } from '@/components/common'
import { UsesPageClient } from '@/features/uses'
import { buildUsesMetadata } from '@/lib/seo'

export const metadata: Metadata = buildUsesMetadata('es')

export default function SpanishUsesPage() {
  return (
    <LocalizedShell locale="es">
      <UsesPageClient />
    </LocalizedShell>
  )
}
