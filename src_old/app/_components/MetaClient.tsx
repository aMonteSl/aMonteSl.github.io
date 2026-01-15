'use client'

import { useEffect } from 'react'
import { useI18n } from '../_i18n/I18nProvider'

export function MetaClient() {
  const { locale, t } = useI18n()

  useEffect(() => {
    // Update document title
    const title = t('meta.title')
    if (title && title !== 'meta.title') {
      document.title = title
    }

    // Update JSON-LD with current locale
    const existingScript = document.querySelector('script[type="application/ld+json"][id="i18n-jsonld"]')
    if (existingScript) {
      existingScript.remove()
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": "https://amontesl.github.io/#person",
          "name": "Adrián Montes Linares",
          "jobTitle": locale === 'es' ? "Estudiante de Ingeniería Telemática" : "Telematics Engineering Student",
          "description": t('meta.description'),
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
            locale === 'es' ? "Visualización de datos" : "Data visualization",
            locale === 'es' ? "Ingeniería Telemática" : "Telematics Engineering"
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://amontesl.github.io/#website",
          "url": "https://amontesl.github.io",
          "name": locale === 'es' ? "Portfolio de Adrián Montes" : "Adrián Montes Portfolio",
          "description": t('meta.description'),
          "publisher": {
            "@id": "https://amontesl.github.io/#person"
          },
          "inLanguage": locale
        }
      ]
    }

    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.id = 'i18n-jsonld'
    script.textContent = JSON.stringify(jsonLd)
    document.head.appendChild(script)
  }, [locale, t])

  return null
}
