import { defaultLocale, locales, type Locale } from '@/i18n'

const BROWSER_LANGUAGES_QUERY_PARAM = 'browserLanguages'

function baseLanguage(tag: string): string {
  return tag.trim().toLowerCase().split('-')[0]
}

/**
 * Picks the first supported locale from a list of BCP-47 tags (most preferred first).
 * `fr-CA, es-MX, en` -> `es`; `fr, de` -> the default locale.
 */
export function negotiateLocale(
  tags: readonly string[],
  available: readonly Locale[] = locales,
  fallback: Locale = defaultLocale,
): Locale {
  for (const tag of tags) {
    if (!tag) continue
    const base = baseLanguage(tag)
    const match = available.find((locale) => locale === base)
    if (match) return match
  }

  return fallback
}

/** True when at least one of the tags is a language the site is written in. */
export function hasSupportedLanguage(tags: readonly string[], available: readonly Locale[] = locales): boolean {
  return tags.some((tag) => Boolean(tag) && available.some((locale) => locale === baseLanguage(tag)))
}

/**
 * The visitor's preferred languages. `?browserLanguages=fr-FR,fr` overrides them for local testing,
 * mirroring the `?journeyToday=` hook used by the journey timeline.
 */
export function getBrowserLanguages(): string[] {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return []
  }

  const override = new URLSearchParams(window.location.search).get(BROWSER_LANGUAGES_QUERY_PARAM)
  if (override) {
    return override.split(',').map((tag) => tag.trim()).filter(Boolean)
  }

  const languages = navigator.languages?.length ? [...navigator.languages] : [navigator.language]
  return languages.filter(Boolean)
}
