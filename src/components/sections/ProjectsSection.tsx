import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { projects } from '../../data/projects';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import type { Project } from '../../data/projects';

export function ProjectsSection() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section 
      id="projects" 
      className="min-h-screen py-section-y px-section-x container-responsive"
    >
      <div className="max-w-content mx-auto">
        <SectionHeader
          title="Featured Projects"
          subtitle="Showcasing my latest work & contributions"
        />
        
        <div className="space-y-fluid-xl max-w-7xl mx-auto">
          {projects.map((project: Project, index: number) => (
            <motion.div
              key={project.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.6, 
                delay: prefersReducedMotion ? 0 : index * 0.1 
              }}
            >
              <Card className="p-fluid-lg xl:p-fluid-xl hover:shadow-2xl transition-all duration-300 group bg-surface-1/80 border-surface-2/50 backdrop-blur-sm hover:bg-surface-1 hover:border-surface-2">
                <div className="grid lg:grid-cols-2 gap-fluid-xl items-center">
                  <div className="space-y-fluid-lg">
                    <div>
                      <h3 className="text-2xl xl:text-3xl font-bold text-accent mb-fluid-sm group-hover:text-accent transition-colors duration-200 balance">
                        {project.title}
                      </h3>
                      <p className="text-muted leading-relaxed text-base xl:text-lg pretty">
                        {project.description}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-fluid-sm">
                      {project.tags.map((tag: string) => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="text-xs xl:text-sm px-3 py-1.5 bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors duration-200"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-fluid-md">
                      {project.links.github && (
                        <a
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-accent hover:text-accent transition-colors duration-200 text-sm xl:text-base font-medium px-4 py-2 bg-accent/10 rounded-full border border-accent/20 hover:bg-accent/20 hover:border-accent/30"
                        >
                          <Github size={18} />
                          Code
                        </a>
                      )}
                      {(project.links.demo || project.links.website) && (
                        <a
                          href={project.links.demo || project.links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-accent hover:text-accent transition-colors duration-200 text-sm xl:text-base font-medium px-4 py-2 bg-accent/10 rounded-full border border-accent/20 hover:bg-accent/20 hover:border-accent/30"
                        >
                          <ExternalLink size={18} />
                          {project.links.demo ? 'Live Demo' : 'Website'}
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="relative overflow-hidden rounded-xl bg-surface-2/20 order-first lg:order-last">
                    <div className="w-full h-64 xl:h-80 bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                      <div className="text-accent text-6xl xl:text-7xl font-bold opacity-20">
                        {project.title.split(' ').map((word: string) => word[0]).join('')}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-1/20 to-transparent"></div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {projects.length === 0 && (
          <div className="text-center py-fluid-2xl">
            <p className="text-muted text-lg xl:text-xl balance">
              More projects coming soon...
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
