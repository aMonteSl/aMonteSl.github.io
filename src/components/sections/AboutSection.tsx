import { motion } from 'framer-motion';
import { SectionHeader } from '../ui/SectionHeader';
import { useProfile } from '../../hooks/useProfile';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';

export function AboutSection() {
  const profile = useProfile();
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section 
      id="about" 
      className="min-h-screen py-section-y px-section-x container-responsive"
    >
      <div className="max-w-content mx-auto">
        <SectionHeader
          title="About Me"
          subtitle="Passionate developer & lifelong learner"
        />
        
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid gap-fluid-xl lg:grid-cols-2 lg:gap-fluid-2xl items-start">
            <div className="space-y-fluid-lg">
              <p className="text-lg xl:text-xl text-muted leading-relaxed pretty">
                {profile.summary}
              </p>
              <p className="text-muted leading-relaxed pretty">
                Currently pursuing my degree in Software Engineering, I combine academic excellence 
                with hands-on experience in cutting-edge technologies. My passion lies in creating 
                innovative solutions that bridge the gap between theoretical knowledge and practical 
                applications.
              </p>
              <p className="text-muted leading-relaxed pretty">
                When I'm not coding, you'll find me exploring new technologies, contributing to 
                open-source projects, or sharing knowledge with fellow developers in the community.
              </p>
            </div>
            
            <div className="space-y-fluid-lg">
              <div className="bg-surface-1/80 rounded-xl p-fluid-lg border border-surface-2/50 backdrop-blur-sm hover:bg-surface-1 transition-colors duration-300">
                <h3 className="text-lg xl:text-xl font-semibold text-accent mb-fluid-md balance">
                  Quick Facts
                </h3>
                <ul className="space-y-fluid-sm text-sm xl:text-base">
                  <FactItem text={`Based in ${profile.location}`} />
                  <FactItem text="Software Engineering Student" />
                  <FactItem text="Passionate about XR & AI" />
                  <FactItem text="Open to collaboration" />
                  <FactItem text="Always learning new technologies" />
                </ul>
              </div>
              
              <div className="bg-surface-1/80 rounded-xl p-fluid-lg border border-surface-2/50 backdrop-blur-sm hover:bg-surface-1 transition-colors duration-300">
                <h3 className="text-lg xl:text-xl font-semibold text-accent mb-fluid-md balance">
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest: string, index: number) => (
                    <motion.span
                      key={interest}
                      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        delay: prefersReducedMotion ? 0 : index * 0.1,
                        duration: prefersReducedMotion ? 0 : 0.3
                      }}
                      viewport={{ once: true }}
                      className="px-3 py-1.5 bg-accent/10 text-accent text-sm rounded-full border border-accent/20 hover:bg-accent/20 hover:border-accent/30 transition-colors duration-200"
                    >
                      {interest}
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

interface FactItemProps {
  text: string;
}

function FactItem({ text }: FactItemProps) {
  return (
    <li className="flex items-center gap-3">
      <span className="w-2 h-2 bg-accent rounded-full flex-shrink-0 animate-pulse"></span>
      <span className="text-muted">{text}</span>
    </li>
  );
}
