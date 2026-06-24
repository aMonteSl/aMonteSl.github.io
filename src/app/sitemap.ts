import { MetadataRoute } from 'next'
import { getProjects } from '@/features/projects'
import { absoluteUrl, LAST_MODIFIED } from '@/lib/seo'
import { localizePath, type Locale } from '@/i18n'

export const dynamic = 'force-static'

const locales: Locale[] = ['en', 'es']

function localizedEntry(
  pathname: string,
  locale: Locale,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(localizePath(pathname, locale)),
    lastModified: LAST_MODIFIED,
    changeFrequency,
    priority,
    alternates: {
      languages: {
        en: absoluteUrl(localizePath(pathname, 'en')),
        es: absoluteUrl(localizePath(pathname, 'es')),
        'x-default': absoluteUrl(localizePath(pathname, 'en')),
      },
    },
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = locales.flatMap((locale) => [
    localizedEntry('/', locale, 1, 'monthly'),
    localizedEntry('/uses', locale, 0.5, 'monthly'),
  ])

  const projectPages = getProjects().flatMap((project) =>
    locales.map((locale) =>
      localizedEntry(`/projects/${project.slug}`, locale, 0.7, 'monthly'),
    ),
  )

  return [...staticPages, ...projectPages]
}
