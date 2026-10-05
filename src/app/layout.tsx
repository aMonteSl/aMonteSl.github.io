import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
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
  keywords: ['Adrián Montes Linares', 'Adrián Montes', 'Telematics Engineer', 'Software Engineer', 'React', 'TypeScript', 'Node.js', 'XR', 'WebXR', 'Code-XR', 'VISSOFT', 'ICSME 2025', 'Universidad Politécnica de Madrid', 'UPM', 'Machine Learning', 'Big Data', 'Cloud', 'Systems N2', 'Model Context Protocol', 'MCP', 'Oxford Test of English C1', 'Portfolio'],
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

// Self-hosted at build time so every device renders the same typeface (no system-font fallback)
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#040304',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* The hero portrait (Avatar size="hero") is the largest image on the first screen */}
        <link
          rel="preload"
          as="image"
          type="image/avif"
          imageSrcSet="/images/profile/hero-320.avif 1x, /images/profile/hero-320@2x.avif 2x"
          href="/images/profile/hero-320.avif"
        />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
