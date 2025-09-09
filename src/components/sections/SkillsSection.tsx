import { motion } from 'framer-motion';
import { Code, Database, Globe, Zap } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { skillCategories } from '../../data/skills';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import type { SkillCategory, Skill } from '../../data/skills';

const categoryIcons = {
  'Programming Languages': Code,
  'Frameworks & Libraries': Zap,
  'Databases & Storage': Database,
  'Tools & Technologies': Globe,
  'Cloud & DevOps': Globe,
  'Other': Zap,
};

export function SkillsSection() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section 
      id="skills" 
      className="min-h-screen py-section-y px-section-x container-responsive"
    >
      <div className="max-w-content mx-auto">
        <SectionHeader
          title="Skills & Technologies"
          subtitle="Tools & technologies I work with"
        />
        
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="grid gap-fluid-xl md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
        >
          {skillCategories.map((category: SkillCategory, index: number) => {
            const IconComponent = categoryIcons[category.name as keyof typeof categoryIcons] || Code;
            
            return (
              <motion.div
                key={`${category.name}-${index}`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: prefersReducedMotion ? 0 : 0.6, 
                  delay: prefersReducedMotion ? 0 : index * 0.1 
                }}
              >
                <Card className="p-fluid-lg xl:p-fluid-xl h-full hover:shadow-xl transition-all duration-300 group bg-surface-1/80 border-surface-2/50 backdrop-blur-sm hover:bg-surface-1 hover:border-surface-2">
                  <div className="flex items-center gap-3 mb-fluid-lg">
                    <div className="w-10 h-10 xl:w-12 xl:h-12 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 group-hover:border-accent/30 transition-colors duration-300">
                      <IconComponent className="text-accent w-5 h-5 xl:w-6 xl:h-6" />
                    </div>
                    <h3 className="text-lg xl:text-xl font-bold text-accent group-hover:text-accent transition-colors duration-200 balance">
                      {category.name}
                    </h3>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill: Skill, skillIndex: number) => (
                      <motion.div
                        key={skill.name}
                        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: prefersReducedMotion ? 0 : 0.3, 
                          delay: prefersReducedMotion ? 0 : index * 0.1 + skillIndex * 0.05 
                        }}
                      >
                        <Badge 
                          variant="secondary" 
                          className="text-xs xl:text-sm px-3 py-1.5 bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 hover:border-accent/30 transition-colors duration-200 cursor-default"
                        >
                          {skill.name}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
