import { defaultLocale, locales, type Locale } from './config'

export const localePrefix = {
  en: '',
  es: '/es',
} as const satisfies Record<Locale, string>

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale)
}

export function getLocaleFromPathname(pathname: string): Locale {
  const firstSegment = pathname.split('/').filter(Boolean)[0]
  return firstSegment && isLocale(firstSegment) ? firstSegment : defaultLocale
}

export function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean)

  if (segments[0] && isLocale(segments[0])) {
    segments.shift()
  }

  return `/${segments.join('/')}`.replace(/\/$/, '') || '/'
}

export function localizePath(pathname: string, locale: Locale): string {
  const normalizedPath = stripLocalePrefix(pathname)
  const prefix = localePrefix[locale]

  if (normalizedPath === '/') {
    return prefix ? `${prefix}/` : '/'
  }

  return `${prefix}${normalizedPath}/`
}

export function localizeHash(hash: string, locale: Locale): string {
  return `${localizePath('/', locale)}${hash}`
}
