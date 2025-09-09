import React from 'react'
import { motion } from 'framer-motion'
import { activities } from '@/data/activities'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function Activities() {
  return (
    <div className="min-h-screen section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            title="Activities"
            subtitle="Community & Learning"
            description="Hackathons, conferences, workshops, and continuous learning activities that shape my professional development."
            centered
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card hover className="h-full">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-text-primary">
                        {activity.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={
                            activity.type === 'hackathon' ? 'primary' :
                            activity.type === 'conference' ? 'success' :
                            activity.type === 'workshop' ? 'warning' :
                            'secondary'
                          } 
                          size="sm"
                        >
                          {activity.type}
                        </Badge>
                        <span className="text-text-muted text-sm">{activity.date}</span>
                      </div>
                    </div>
                  </div>

                  {activity.role && (
                    <p className="text-primary font-medium text-sm">
                      {activity.role}
                    </p>
                  )}

                  {activity.organization && (
                    <p className="text-text-muted text-sm">
                      {activity.organization} {activity.location && `• ${activity.location}`}
                    </p>
                  )}

                  <p className="text-text-muted leading-relaxed">
                    {activity.description}
                  </p>

                  {activity.achievements && activity.achievements.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-text-primary">
                        Key Achievements:
                      </h4>
                      <ul className="space-y-1">
                        {activity.achievements.map((achievement, i) => (
                          <li key={i} className="text-text-muted text-sm flex items-start">
                            <span className="text-primary mr-2 mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activity.skills && activity.skills.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-text-primary">
                        Skills Developed:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {activity.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" size="sm">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
