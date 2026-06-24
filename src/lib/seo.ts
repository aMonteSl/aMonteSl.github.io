import type { Metadata } from 'next'
import { LINKS, SITE } from '@/lib/constants'
import { localizePath, type Locale } from '@/i18n'
import { getLocalizedProjectTitle, type Project } from '@/features/projects'
import enMessages from '@/i18n/messages/en.json'
import esMessages from '@/i18n/messages/es.json'

const messages = {
  en: enMessages,
  es: esMessages,
} as const

export const OG_IMAGE = '/images/og/portfolio.png'
export const LAST_MODIFIED = '2026-05-09'

const localeMeta = {
  en: {
    ogLocale: 'en_US',
    alternateLocale: 'es_ES',
  },
  es: {
    ogLocale: 'es_ES',
    alternateLocale: 'en_US',
  },
} as const satisfies Record<Locale, { ogLocale: string; alternateLocale: string }>

export function absoluteUrl(pathname = '/'): string {
  return new URL(pathname, `${SITE.url}/`).toString()
}

export function getRouteUrl(pathname: string, locale: Locale): string {
  return absoluteUrl(localizePath(pathname, locale))
}

export function getAlternates(pathname: string, locale: Locale): Metadata['alternates'] {
  return {
    canonical: getRouteUrl(pathname, locale),
    languages: {
      en: getRouteUrl(pathname, 'en'),
      es: getRouteUrl(pathname, 'es'),
      'x-default': getRouteUrl(pathname, 'en'),
    },
  }
}

export function buildPageMetadata({
  locale,
  pathname,
  title,
  description,
  image = OG_IMAGE,
  type = 'website',
}: {
  locale: Locale
  pathname: string
  title: string
  description: string
  image?: string
  type?: 'website' | 'article'
}): Metadata {
  const url = getRouteUrl(pathname, locale)
  const imageUrl = absoluteUrl(image)

  return {
    title: {
      absolute: title,
    },
    description,
    alternates: getAlternates(pathname, locale),
    openGraph: {
      type,
      locale: localeMeta[locale].ogLocale,
      alternateLocale: localeMeta[locale].alternateLocale,
      url,
      title,
      description,
      siteName: SITE.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export function buildHomeMetadata(locale: Locale): Metadata {
  return buildPageMetadata({
    locale,
    pathname: '/',
    title: messages[locale].meta.title,
    description: messages[locale].meta.description,
  })
}

export function buildUsesMetadata(locale: Locale): Metadata {
  const title = locale === 'es'
    ? `Uses | ${SITE.author}`
    : `Uses | ${SITE.author}`
  const description = locale === 'es'
    ? 'Herramientas, hardware y software que Adrián Montes usa para desarrollar productos, visualizaciones XR y proyectos full-stack.'
    : 'Tools, hardware, and software Adrián Montes uses to build products, XR visualizations, and full-stack projects.'

  return buildPageMetadata({
    locale,
    pathname: '/uses',
    title,
    description,
  })
}

export function buildProjectMetadata(
  project: Project,
  locale: Locale,
  image?: string,
): Metadata {
  const description = locale === 'es' ? project.summary_es : project.summary_en
  const title = getLocalizedProjectTitle(project, locale)

  return buildPageMetadata({
    locale,
    pathname: `/projects/${project.slug}`,
    title: `${title} | ${SITE.author}`,
    description,
    image,
    type: project.type === 'academic' ? 'article' : 'website',
  })
}

export function buildHomeJsonLd(locale: Locale): Record<string, unknown> {
  const url = getRouteUrl('/', locale)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': `${url}#profile`,
        url,
        name: messages[locale].meta.title,
        description: messages[locale].meta.description,
        inLanguage: locale,
        mainEntity: {
          '@id': `${SITE.url}/#person`,
        },
      },
      {
        '@type': 'Person',
        '@id': `${SITE.url}/#person`,
        name: SITE.author,
        alternateName: [
          'Adrián Montes',
          'Adrian Montes',
          'Adrián Montes Linares',
          'Adrian Montes Linares',
          'aMonteSl',
        ],
        givenName: 'Adrián',
        familyName: 'Montes Linares',
        jobTitle: ['Telecommunications Engineer', 'Software Engineer'],
        description: 'Full-stack developer focused on TypeScript, React, Node.js, DevTools, and XR software visualization.',
        url: SITE.url,
        email: LINKS.email,
        image: absoluteUrl('/images/profile/hero-320.jpg'),
        sameAs: [LINKS.github, LINKS.linkedin],
        alumniOf: {
          '@type': 'EducationalOrganization',
          name: 'Universidad Rey Juan Carlos',
          url: 'https://www.urjc.es',
        },
        knowsAbout: [
          'TypeScript',
          'React',
          'Next.js',
          'Node.js',
          'WebXR',
          'Software Engineering',
          'Data Visualization',
          'Azure',
        ],
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE.url}/#website`,
        url: SITE.url,
        name: SITE.name,
        description: messages[locale].meta.description,
        publisher: {
          '@id': `${SITE.url}/#person`,
        },
        inLanguage: locale,
      },
    ],
  }
}

export function buildProjectJsonLd(
  project: Project,
  locale: Locale,
  image?: string,
): Record<string, unknown> {
  const url = getRouteUrl(`/projects/${project.slug}`, locale)
  const description = locale === 'es' ? project.summary_es : project.summary_en
  const title = getLocalizedProjectTitle(project, locale)
  const type = project.slug === 'code-xr' ? 'SoftwareApplication' : 'CreativeWork'

  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${url}#project`,
    name: title,
    description,
    url,
    image: absoluteUrl(image || OG_IMAGE),
    author: {
      '@id': `${SITE.url}/#person`,
      '@type': 'Person',
      name: SITE.author,
    },
    inLanguage: locale,
    sameAs: [project.repoUrl, project.demoUrl].filter(Boolean),
    ...(project.slug === 'code-xr'
      ? {
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Visual Studio Code',
          downloadUrl: LINKS.codeXrMarketplace,
          citation: LINKS.codeXrDoi,
        }
      : {}),
  }
}
