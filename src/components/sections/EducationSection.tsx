import { motion } from 'framer-motion';
import { GraduationCap, Award, Calendar, MapPin } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { education } from '../../data/education';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import type { Education } from '../../data/education';

export function EducationSection() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section 
      id="education" 
      className="py-20 px-6 bg-gradient-to-b from-surface-1/30 to-bg"
    >
      <div className="max-w-content mx-auto">
        <SectionHeader
          title="Education"
          subtitle="Academic journey & achievements"
        />
        
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="space-y-fluid-lg max-w-5xl mx-auto"
        >
          {education.map((edu: Education, index: number) => (
            <motion.div
              key={edu.id}
              initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.6, 
                delay: prefersReducedMotion ? 0 : index * 0.1 
              }}
            >
              <Card className="p-fluid-lg xl:p-fluid-xl hover:shadow-xl transition-all duration-300 group bg-surface-1/80 border-surface-2/50 backdrop-blur-sm hover:bg-surface-1 hover:border-surface-2">
                <div className="flex items-start gap-fluid-lg">
                  <div className="flex-shrink-0 w-12 h-12 xl:w-16 xl:h-16 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 group-hover:border-accent/30 transition-colors duration-300">
                    <GraduationCap className="w-6 h-6 xl:w-8 xl:h-8 text-accent" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-fluid-sm mb-fluid-md">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl xl:text-2xl font-bold text-accent group-hover:text-accent transition-colors duration-200 balance">
                          {edu.degree}
                        </h3>
                        <p className="text-lg xl:text-xl text-accent font-medium mt-1 balance">
                          {edu.institution}
                        </p>
                        <div className="flex items-center gap-2 text-sm xl:text-base text-muted mt-1">
                          <MapPin size={14} className="text-accent" />
                          <span>{edu.location}</span>
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 space-y-2">
                        <div className="flex items-center gap-2 text-sm xl:text-base text-muted">
                          <Calendar size={16} className="text-accent" />
                          <span>{edu.startDate} - {edu.endDate}</span>
                        </div>
                        {edu.gpa && (
                          <div className="flex items-center gap-2 text-sm xl:text-base">
                            <Award size={16} className="text-accent" />
                            <span className="text-accent font-medium">
                              GPA: {edu.gpa}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {edu.description && (
                      <p className="text-muted leading-relaxed mb-fluid-md text-base xl:text-lg pretty">
                        {edu.description}
                      </p>
                    )}
                    
                    {edu.honors && edu.honors.length > 0 && (
                      <div>
                        <h4 className="text-sm xl:text-base font-semibold text-accent mb-fluid-sm">
                          Honors & Achievements
                        </h4>
                        <ul className="space-y-2">
                          {edu.honors.map((honor: string, idx: number) => (
                            <motion.li 
                              key={idx} 
                              initial={prefersReducedMotion ? false : { opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ 
                                delay: prefersReducedMotion ? 0 : idx * 0.1,
                                duration: prefersReducedMotion ? 0 : 0.3
                              }}
                              viewport={{ once: true }}
                              className="flex items-start gap-3 text-sm xl:text-base text-muted"
                            >
                              <span className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0 animate-pulse"></span>
                              <span className="pretty">{honor}</span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
