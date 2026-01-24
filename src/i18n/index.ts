// Navigation exports (Link, redirect, usePathname, useRouter with locale support)
export { Link, redirect, usePathname, useRouter } from './navigation'

// Config exports
export { locales, defaultLocale, localeNames, localeFlags } from './config'
export type { Locale } from './config'

// Re-export next-intl hooks
export { useTranslations, useLocale } from 'next-intl'
