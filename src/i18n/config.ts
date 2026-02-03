// Locale configuration for next-intl
export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

// Locale display names for UI
export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español'
}

// Locale flags for UI
export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  es: '🇪🇸'
}
