import type { Metadata } from 'next'
import { JsonLd, LocalizedShell } from '@/components/common'
import { HomePageClient } from '@/features/landing'
import { buildHomeJsonLd, buildHomeMetadata } from '@/lib/seo'

export const metadata: Metadata = buildHomeMetadata('en')

export default function Home() {
  return (
    <LocalizedShell locale="en">
      <JsonLd data={buildHomeJsonLd('en')} />
      <HomePageClient />
    </LocalizedShell>
  )
}
