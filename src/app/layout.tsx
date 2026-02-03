// Root layout component with i18n provider and theme setup
import type { Metadata } from 'next'
import './globals.css'
import { I18nProvider } from '@/i18n'
import { Footer } from '@/components/common/Footer'
import { SITE, LINKS } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Adrián Montes Linares | Telecommunications & Software Engineer',
  description: 'Portfolio of Adrián Montes Linares — Telecommunications & Software Engineer. Full-Stack (TypeScript/Node/React), DevTools & XR. Author of Code-XR (VISSOFT @ ICSME 2025).',
  keywords: ['Adrián Montes Linares', 'Adrián Montes', 'Telecommunications Engineer', 'Software Engineer', 'React', 'TypeScript', 'Node.js', 'XR', 'WebXR', 'Code-XR', 'VISSOFT', 'ICSME 2025', 'Portfolio'],
  authors: [{ name: SITE.author }],
  creator: SITE.author,
  manifest: '/favicons/site.webmanifest',
  icons: {
    icon: [
      { url: '/favicons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicons/favicon.ico', sizes: '48x48' },
    ],
    apple: [
      { url: '/favicons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE.url,
    title: 'Adrián Montes Linares | Telecommunications & Software Engineer',
    description: 'Portfolio of Adrián Montes Linares — Telecommunications & Software Engineer. Full-Stack (TypeScript/Node/React), DevTools & XR. Code-XR author.',
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adrián Montes Linares | Telecommunications & Software Engineer',
    description: 'Portfolio of Adrián Montes Linares — Telecommunications & Software Engineer. Full-Stack (TypeScript/Node/React), DevTools & XR.',
  },
  alternates: {
    canonical: SITE.url,
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

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': `${SITE.url}/#person`,
      name: 'Adrián Montes Linares',
      givenName: 'Adrián',
      familyName: 'Montes Linares',
      jobTitle: ['Telecommunications Engineer', 'Software Engineer'],
      description: 'Full-Stack developer (TypeScript/Node/React), DevTools & XR specialist. Author of Code-XR, presented at VISSOFT @ ICSME 2025.',
      url: SITE.url,
      email: 'adrian.monteslinares@gmail.com',
      sameAs: [
        LINKS.github,
        LINKS.linkedin
      ],
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'Universidad Rey Juan Carlos',
        url: 'https://www.urjc.es'
      },
      knowsAbout: [
        'TypeScript',
        'Node.js',
        'React',
        'Next.js',
        'Express',
        'WebXR',
        'Software Engineering',
        'Data Visualization',
        'Azure',
        'DevTools',
        'Telecommunications'
      ],
      hasCredential: {
        '@type': 'EducationalOccupationalCredential',
        name: 'VISSOFT @ ICSME 2025 Publication',
        description: 'Paper accepted at VISSOFT 2025, co-located with ICSME'
      }
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE.url}/#website`,
      url: SITE.url,
      name: SITE.name,
      description: `Personal portfolio of ${SITE.author}`,
      publisher: {
        '@id': `${SITE.url}/#person`
      },
      inLanguage: 'en'
    }
  ]
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#040304" />
        <link
          rel="preload"
          as="image"
          imageSrcSet="/images/profile/hero-196.avif 1x, /images/profile/hero-196@2x.avif 2x"
          imageSizes="196px"
          href="/images/profile/hero-196.avif"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <I18nProvider>
          <a href="#main-content" className="skip-to-content">
            Skip to main content
          </a>
          <main id="main-content">
            {children}
          </main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  )
}
