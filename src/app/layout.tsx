import type { Metadata } from 'next'
import './globals.css'
import { SITE } from '@/lib/constants'
import { OG_IMAGE } from '@/lib/seo'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.author} | Telematics & Software Engineer`,
    template: `%s | ${SITE.author}`,
  },
  description: 'Portfolio of Adrián Montes Linares, Telematics & Software Engineer focused on TypeScript, React, Node.js, DevTools and XR.',
  keywords: ['Adrián Montes Linares', 'Adrián Montes', 'Telematics Engineer', 'Software Engineer', 'React', 'TypeScript', 'Node.js', 'XR', 'WebXR', 'Code-XR', 'VISSOFT', 'ICSME 2025', 'Portfolio'],
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
    title: `${SITE.author} | Telematics & Software Engineer`,
    description: 'Portfolio of Adrián Montes Linares, Telematics & Software Engineer focused on TypeScript, React, Node.js, DevTools and XR.',
    siteName: SITE.name,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${SITE.author} portfolio preview`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.author} | Telematics & Software Engineer`,
    description: 'Portfolio of Adrián Montes Linares, Telematics & Software Engineer focused on TypeScript, React, Node.js, DevTools and XR.',
    images: [OG_IMAGE],
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
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
