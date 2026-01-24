import { createNavigation } from 'next-intl/navigation'
import { locales } from './config'

// Create navigation helpers with locale support
export const { Link, redirect, usePathname, useRouter } = createNavigation({
  locales
})
