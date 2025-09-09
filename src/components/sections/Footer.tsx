import React from 'react'
import { Link } from 'react-router-dom'
import { profile } from '@/data/profile'
import { contacts } from '@/data/contacts'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-text-primary mb-3">
              {profile.name}
            </h3>
            <p className="text-text-muted text-sm leading-relaxed max-w-md">
              {profile.summary}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/projects" className="text-text-muted hover:text-primary text-sm transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link to="/education" className="text-text-muted hover:text-primary text-sm transition-colors">
                  Education
                </Link>
              </li>
              <li>
                <Link to="/skills" className="text-text-muted hover:text-primary text-sm transition-colors">
                  Skills
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-text-muted hover:text-primary text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-text-primary mb-3 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2">
              {contacts.filter(contact => contact.primary).map((contact) => (
                <li key={contact.type}>
                  <a
                    href={contact.href}
                    className="text-text-muted hover:text-primary text-sm transition-colors"
                    target={contact.type === 'email' ? undefined : '_blank'}
                    rel={contact.type === 'email' ? undefined : 'noopener noreferrer'}
                  >
                    {contact.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-text-muted text-sm">
            © {currentYear} {profile.name}. All rights reserved.
          </p>
          <p className="text-text-muted text-sm mt-2 sm:mt-0">
            Built with React, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  )
}
