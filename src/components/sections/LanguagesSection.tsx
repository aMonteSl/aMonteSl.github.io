import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Card } from '../ui/Card';
import { languages } from '../../data/languages';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import type { Language } from '../../data/languages';

const proficiencyColors = {
  'native': 'bg-accent border-accent',
  'fluent': 'bg-accent/80 border-accent/80',
  'advanced': 'bg-accent/60 border-accent/60',
  'intermediate': 'bg-accent/40 border-accent/40',
  'beginner': 'bg-accent/20 border-accent/20',
};

export function LanguagesSection() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section 
      id="languages" 
      className="py-20 px-6 bg-gradient-to-b from-bg to-surface-1/30"
    >
      <div className="max-w-content mx-auto">
        <SectionHeader
          title="Languages"
          subtitle="Global communication capabilities"
        />
        
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="grid gap-fluid-lg md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-6xl mx-auto"
        >
          {languages.map((language: Language, index: number) => (
            <motion.div
              key={language.name}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.6, 
                delay: prefersReducedMotion ? 0 : index * 0.1 
              }}
            >
              <Card className="p-fluid-lg xl:p-fluid-xl text-center hover:shadow-xl transition-all duration-300 group bg-surface-1/80 border-surface-2/50 backdrop-blur-sm hover:bg-surface-1 hover:border-surface-2 h-full">
                <div className="flex flex-col items-center space-y-fluid-md h-full">
                  <div className="w-16 h-16 xl:w-20 xl:h-20 bg-accent/10 rounded-full flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 group-hover:border-accent/30 transition-colors duration-300">
                    <Globe className="text-accent w-8 h-8 xl:w-10 xl:h-10" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <h3 className="text-lg xl:text-xl font-bold text-accent mb-fluid-sm group-hover:text-accent transition-colors duration-200 balance">
                      {language.name}
                    </h3>
                    
                    <div className="flex items-center justify-center gap-2 mb-fluid-sm">
                      <span 
                        className={`w-3 h-3 xl:w-4 xl:h-4 rounded-full border ${
                          proficiencyColors[language.level] || 'bg-accent/30 border-accent/30'
                        }`}
                      />
                      <span className="text-sm xl:text-base text-accent font-medium capitalize">
                        {language.level}
                      </span>
                    </div>
                    
                    {language.description && (
                      <p className="text-xs xl:text-sm text-muted pretty leading-relaxed">
                        {language.description}
                      </p>
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
