import type { Metadata } from 'next'
import { LocalizedShell } from '@/components/common'
import { UsesPageClient } from '@/features/uses'
import { buildUsesMetadata } from '@/lib/seo'

export const metadata: Metadata = buildUsesMetadata('en')

export default function UsesPage() {
  return (
    <LocalizedShell locale="en">
      <UsesPageClient />
    </LocalizedShell>
  )
}
