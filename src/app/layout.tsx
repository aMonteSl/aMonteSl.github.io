import type { Metadata } from "next";
import "./globals.css";
import { Header } from "./_components/Header";
import { Footer } from "./_components/Footer";
import { I18nProvider } from "./_i18n/I18nProvider";
import { MetaClient } from "./_components/MetaClient";
import ScrollProgress from "./_components/ScrollProgress";
import ScrollGuard from "./_components/ScrollGuard";

export const metadata: Metadata = {
  title: "Adrián Montes — Portfolio",
  description: "Portfolio de Adrián Montes Linares, estudiante de Ingeniería Telemática especializado en React, visualización XR y software engineering. Autor de Code-XR.",
  keywords: ["Adrián Montes", "Ingeniería Telemática", "React", "XR", "WebXR", "Software Engineering", "Portfolio", "Code-XR"],
  authors: [{ name: "Adrián Montes Linares" }],
  creator: "Adrián Montes Linares",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://amontesl.github.io",
    title: "Adrián Montes — Portfolio",
    description: "Portfolio de Adrián Montes Linares, estudiante de Ingeniería Telemática especializado en React, visualización XR y software engineering.",
    siteName: "Adrián Montes Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adrián Montes — Portfolio",
    description: "Portfolio de Adrián Montes Linares, estudiante de Ingeniería Telemática especializado en React, visualización XR y software engineering.",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": "https://amontesl.github.io/#person",
        "name": "Adrián Montes Linares",
        "jobTitle": "Estudiante de Ingeniería Telemática",
        "description": "Especializado en React, visualización XR y software engineering. Autor de Code-XR.",
        "url": "https://amontesl.github.io",
        "sameAs": [
          "https://github.com/aMonteSl",
          "https://linkedin.com/in/adrian-montes-linares"
        ],
        "alumniOf": {
          "@type": "EducationalOrganization",
          "name": "Universidad Rey Juan Carlos",
          "url": "https://www.urjc.es"
        },
        "knowsAbout": [
          "React",
          "Next.js",
          "WebXR",
          "Software Engineering",
          "Visualización de datos",
          "Ingeniería Telemática"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://amontesl.github.io/#website",
        "url": "https://amontesl.github.io",
        "name": "Adrián Montes Portfolio",
        "description": "Portfolio personal de Adrián Montes Linares",
        "publisher": {
          "@id": "https://amontesl.github.io/#person"
        },
        "inLanguage": "es"
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        {/* Theme color */}
        <meta name="theme-color" content="#040304" />
        
        {/* Preload hero image variants */}
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
          <MetaClient />
          <a href="#main-content" className="skip-to-content">
            Saltar al contenido principal
          </a>
          <Header />
          <ScrollGuard />
          <ScrollProgress />
          <main id="main-content">
            {children}
          </main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
