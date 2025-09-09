import React from 'react'
import { profile } from '@/data/profile'
import { contacts } from '@/data/contacts'
import { navSections } from '@/data/nav'
import { useScrollSpy } from '@/hooks/useScrollSpy'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const { scrollToSection } = useScrollSpy()

  return (
    <footer className="bg-surface-1 border-t border-surface-2 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-ink mb-3">
              {profile.name}
            </h3>
            <p className="text-muted text-sm leading-relaxed max-w-md">
              {profile.summary}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {navSections.slice(0, 4).map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className="text-muted hover:text-accent text-sm transition-colors text-left"
                  >
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-accent mb-3 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-muted hover:text-accent text-sm transition-colors"
                >
                  {profile.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent text-sm transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href={`https://${profile.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted hover:text-accent text-sm transition-colors"
                >
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-2 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted text-sm">
            © {currentYear} {profile.name}. All rights reserved.
          </p>
          <p className="text-muted text-sm mt-2 sm:mt-0">
            Built with React, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
