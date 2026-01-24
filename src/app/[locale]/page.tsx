import { locales } from '@/i18n/config'
import { HomeClient } from './HomeClient'

// Generate static params for all locales (required for static export)
export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default function Home() {
  return <HomeClient />
}
