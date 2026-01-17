import type { Metadata } from 'next'
import './globals.css'
import { I18nProvider } from '@/i18n'
import { Footer } from '@/components/common/Footer'
import { SITE, LINKS } from '@/lib/constants'

export const metadata: Metadata = {
  title: 'Adrián Montes — Portfolio',
  description: 'Portfolio of Adrián Montes Linares, Telematics Engineering student specialized in React, XR visualization and software engineering. Author of Code-XR.',
  keywords: ['Adrián Montes', 'Telematics Engineering', 'React', 'XR', 'WebXR', 'Software Engineering', 'Portfolio', 'Code-XR'],
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
    title: 'Adrián Montes — Portfolio',
    description: 'Portfolio of Adrián Montes Linares, Telematics Engineering student specialized in React, XR visualization and software engineering.',
    siteName: SITE.name,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Adrián Montes — Portfolio',
    description: 'Portfolio of Adrián Montes Linares, Telematics Engineering student specialized in React, XR visualization and software engineering.',
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
      name: SITE.author,
      jobTitle: 'Telematics Engineering Student',
      description: 'Specialized in React, XR visualization and software engineering. Author of Code-XR.',
      url: SITE.url,
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
        'React',
        'Next.js',
        'WebXR',
        'Software Engineering',
        'Data Visualization',
        'Telematics Engineering'
      ]
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
