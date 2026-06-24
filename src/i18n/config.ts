export const locales = ['en', 'es'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
}

export const localeFlags: Record<Locale, string> = {
  en: 'GB',
  es: 'ES',
}
