import { motion } from 'framer-motion';
import { Activity, Calendar, MapPin } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Card } from '../ui/Card';
import { activities } from '../../data/activities';
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery';
import type { Activity as ActivityType } from '../../data/activities';

export function ActivitiesSection() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section 
      id="activities" 
      className="py-20 px-6 bg-gradient-to-b from-bg to-surface-1/20"
    >
      <div className="max-w-content mx-auto">
        <SectionHeader
          title="Activities & Involvement"
          subtitle="Beyond the code - community & leadership"
        />
        
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
          className="grid gap-fluid-xl md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto"
        >
          {activities.map((activity: ActivityType, index: number) => (
            <motion.div
              key={activity.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: prefersReducedMotion ? 0 : 0.6, 
                delay: prefersReducedMotion ? 0 : index * 0.1 
              }}
            >
              <Card className="p-fluid-lg xl:p-fluid-xl h-full hover:shadow-xl transition-all duration-300 group bg-surface-1/80 border-surface-2/50 backdrop-blur-sm hover:bg-surface-1 hover:border-surface-2">
                <div className="flex items-start gap-fluid-md">
                  <div className="flex-shrink-0 w-10 h-10 xl:w-12 xl:h-12 bg-accent/10 rounded-xl flex items-center justify-center border border-accent/20 group-hover:bg-accent/20 group-hover:border-accent/30 transition-colors duration-300">
                    <Activity className="text-accent w-5 h-5 xl:w-6 xl:h-6" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg xl:text-xl font-bold text-accent mb-fluid-sm group-hover:text-accent transition-colors duration-200 balance">
                      {activity.title}
                    </h3>
                    <p className="text-accent font-medium mb-fluid-sm text-base xl:text-lg balance">
                      {activity.organization}
                    </p>
                    
                    <div className="flex flex-col gap-1 text-xs xl:text-sm text-muted mb-fluid-md">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-accent" />
                        <span>{activity.date}</span>
                      </div>
                      {activity.location && (
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-accent" />
                          <span>{activity.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-muted leading-relaxed text-sm xl:text-base pretty">
                      {activity.description}
                    </p>
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
