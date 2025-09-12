'use client'

import Link from 'next/link'
import { useI18n } from '../_i18n/I18nProvider'
import linksData from '../_content/links.json'

export function Footer() {
  const { t } = useI18n()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and description */}
          <div>
            <Link 
              href="/" 
              className="text-lg font-bold text-fg hover:text-accent transition-colors"
            >
              Adrián Montes
            </Link>
            <p className="mt-2 text-sm text-fg-muted max-w-xs">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-fg mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="#home"
                  className="text-sm text-fg-muted hover:text-fg transition-colors"
                >
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <a 
                  href="/cv/AdrianMontesLinares_CV.pdf"
                  download
                  className="text-sm text-fg-muted hover:text-fg transition-colors"
                >
                  {t('hero.ctaResume')}
                </a>
              </li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-sm font-semibold text-fg mb-4">{t('contact.title')}</h3>
            <div className="space-y-2 text-sm text-fg-muted">
              <a 
                href={`mailto:${linksData.email}`}
                className="block hover:text-fg transition-colors"
              >
                {t('contact.email')}
              </a>
              <a 
                href={linksData.github}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-fg transition-colors"
              >
                {t('contact.github')}
              </a>
              <a 
                href={linksData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-fg transition-colors"
              >
                {t('contact.linkedin')}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-center text-sm text-fg-muted">
            © {currentYear} {t('footer.copyright')} {t('footer.by')}
          </p>
        </div>
      </div>
    </footer>
  )
}
