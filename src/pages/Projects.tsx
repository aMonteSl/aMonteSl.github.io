import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { projects } from '@/data/projects'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { trackProjectView, trackExternalLink } from '@/lib/analytics'

export function Projects() {
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  
  // Get all unique tags
  const allTags = Array.from(new Set(projects.flatMap(p => p.tags)))
  
  // Filter projects by selected tag
  const filteredProjects = selectedTag 
    ? projects.filter(p => p.tags.includes(selectedTag))
    : projects

  return (
    <div className="min-h-screen section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            title="Projects"
            subtitle="Portfolio"
            description="Explore my software development projects, research work, and technical contributions."
            centered
          />
        </motion.div>

        {/* Tag Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12 mb-8"
        >
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedTag === null ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedTag(null)}
            >
              All
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="space-y-4">
                  {/* Project Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold text-text-primary">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <Badge variant="primary" size="sm">
                            Featured
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <span>{project.year}</span>
                        <span>•</span>
                        <Badge 
                          variant={project.status === 'completed' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {project.status}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-text-muted leading-relaxed">
                    {project.description}
                  </p>

                  {/* Highlights */}
                  {project.highlights && project.highlights.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-text-primary">
                        Key Highlights:
                      </h4>
                      <ul className="space-y-1">
                        {project.highlights.slice(0, 3).map((highlight, i) => (
                          <li key={i} className="text-text-muted text-sm flex items-start">
                            <span className="text-primary mr-2 mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        size="sm"
                        className="cursor-pointer hover:bg-primary/20 hover:text-primary"
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {project.links.website && (
                      <Button
                        as="a"
                        href={project.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          trackProjectView(project.title)
                          trackExternalLink(project.links.website!)
                        }}
                      >
                        View Project
                      </Button>
                    )}
                    
                    {project.links.github && (
                      <Button
                        as="a"
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          trackProjectView(project.title)
                          trackExternalLink(project.links.github!)
                        }}
                      >
                        GitHub
                      </Button>
                    )}
                    
                    {project.links.demo && (
                      <Button
                        as="a"
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          trackProjectView(project.title)
                          trackExternalLink(project.links.demo!)
                        }}
                      >
                        Demo
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-text-muted">
              No projects found with the selected tag.
            </p>
            <Button
              variant="ghost"
              onClick={() => setSelectedTag(null)}
              className="mt-4"
            >
              View All Projects
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
