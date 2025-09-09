import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { profile } from '@/data/profile'
import { projects } from '@/data/projects'
import { contacts } from '@/data/contacts'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { trackDownloadCV, trackContactClick, trackProjectView } from '@/lib/analytics'

export function Home() {
  const featuredProject = projects.find(p => p.featured)
  const primaryContacts = contacts.filter(c => c.primary)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold text-text-primary">
                Hi, I'm{' '}
                <span className="text-gradient">
                  Adrián Montes
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-text-muted leading-relaxed">
                {profile.title}
              </p>
              
              <p className="text-lg text-text-muted max-w-3xl mx-auto leading-relaxed">
                {profile.summary}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <Button
                  as="a"
                  href="/CV_Final.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackDownloadCV()}
                  className="btn-primary"
                >
                  View CV (PDF)
                </Button>
                
                <div className="flex gap-3">
                  {primaryContacts.map((contact) => (
                    <Button
                      key={contact.type}
                      as="a"
                      href={contact.href}
                      target={contact.type === 'email' ? undefined : '_blank'}
                      rel={contact.type === 'email' ? undefined : 'noopener noreferrer'}
                      variant="secondary"
                      onClick={() => trackContactClick(contact.type)}
                    >
                      {contact.label}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Project Section */}
      {featuredProject && (
        <section className="section-padding bg-surface/30">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <p className="text-primary font-medium text-sm uppercase tracking-wider mb-2">
                  Featured Project
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary">
                  {featuredProject.title}
                </h2>
              </div>
              
              <Card hover className="text-center">
                <div className="space-y-6">
                  <div className="inline-flex items-center px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                    {featuredProject.year} • {featuredProject.status}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-text-primary">
                    {featuredProject.title}
                  </h3>
                  
                  <p className="text-text-muted leading-relaxed">
                    {featuredProject.longDescription || featuredProject.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-center">
                    {featuredProject.tags.map((tag) => (
                      <Badge key={tag} variant="primary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {featuredProject.links.website && (
                      <Button
                        as="a"
                        href={featuredProject.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackProjectView(featuredProject.title)}
                        variant="primary"
                      >
                        View Documentation
                      </Button>
                    )}
                    
                    {featuredProject.links.github && (
                      <Button
                        as="a"
                        href={featuredProject.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackProjectView(featuredProject.title)}
                        variant="secondary"
                      >
                        View GitHub
                      </Button>
                    )}
                    
                    <Button
                      as={Link}
                      to="/projects"
                      variant="ghost"
                    >
                      View All Projects
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Quick Stats */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <Card className="text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">2025</div>
                <div className="text-text-muted">Graduation Year</div>
              </div>
            </Card>
            
            <Card className="text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">1</div>
                <div className="text-text-muted">Published Research</div>
              </div>
            </Card>
            
            <Card className="text-center">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">2</div>
                <div className="text-text-muted">Academic Honors</div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
