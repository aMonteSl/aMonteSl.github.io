import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { contacts } from '@/data/contacts'
import { profile } from '@/data/profile'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { trackContactClick, trackDownloadCV } from '@/lib/analytics'

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create mailto link with form data
    const subject = encodeURIComponent(formData.subject || 'Contact from Portfolio Website')
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    )
    
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
    trackContactClick('form')
  }

  return (
    <div className="min-h-screen section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            title="Get In Touch"
            subtitle="Contact"
            description="Let's discuss collaboration opportunities, internships, or innovative software projects."
            centered
          />
        </motion.div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Contact Information
              </h3>
              <p className="text-text-muted leading-relaxed mb-6">
                I'm currently seeking internship opportunities and always open to discussing 
                innovative projects, collaboration opportunities, or technical challenges.
              </p>
            </div>

            <div className="space-y-6">
              {contacts.map((contact) => (
                <Card key={contact.type} className="transition-colors hover:border-border-hover">
                  <a
                    href={contact.href}
                    target={contact.type === 'email' ? undefined : '_blank'}
                    rel={contact.type === 'email' ? undefined : 'noopener noreferrer'}
                    onClick={() => trackContactClick(contact.type)}
                    className="flex items-center space-x-4 text-left w-full"
                  >
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-primary rounded" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">
                        {contact.label}
                      </h4>
                      <p className="text-text-muted text-sm">
                        {contact.value}
                      </p>
                    </div>
                  </a>
                </Card>
              ))}
            </div>

            <div className="pt-6">
              <Button
                as="a"
                href="/CV_Final.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackDownloadCV()}
                variant="primary"
                fullWidth
              >
                Download CV (PDF)
              </Button>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-text-primary mb-4">
                    Send a Message
                  </h3>
                  <p className="text-text-muted text-sm mb-6">
                    Fill out the form below and I'll get back to you as soon as possible.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary placeholder-text-muted"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary placeholder-text-muted"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-text-primary mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary placeholder-text-muted"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-text-primary mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary placeholder-text-muted resize-none"
                    placeholder="Tell me about your project, opportunity, or question..."
                  />
                </div>

                <Button type="submit" variant="primary" fullWidth>
                  Send Message
                </Button>

                <p className="text-text-muted text-xs text-center">
                  This form opens your default email client with the message pre-filled.
                </p>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
