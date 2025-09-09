import React from 'react'
import { motion } from 'framer-motion'
import { education, achievements } from '@/data/education'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Timeline } from '@/components/ui/Timeline'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function Education() {
  const timelineItems = [
    ...education.map(edu => ({
      id: edu.id,
      title: edu.degree,
      subtitle: edu.institution,
      date: edu.endDate ? `${edu.startDate} - ${edu.endDate}` : edu.startDate,
      description: edu.description,
      type: 'default' as const
    })),
    ...achievements.map(achievement => ({
      id: achievement.id,
      title: achievement.title,
      subtitle: achievement.description,
      date: achievement.date,
      details: achievement.details,
      type: 'highlight' as const
    }))
  ].sort((a, b) => {
    const yearA = parseInt(a.date.split(' ')[0] || '0')
    const yearB = parseInt(b.date.split(' ')[0] || '0')
    return yearB - yearA
  })

  return (
    <div className="min-h-screen section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            title="Education & Achievements"
            subtitle="Academic Journey"
            description="My educational background and academic achievements in Telematics Engineering and software development."
            centered
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <Timeline items={timelineItems} />
        </motion.div>

        {/* Academic Honors Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20"
        >
          <h3 className="text-2xl font-bold text-text-primary text-center mb-8">
            Academic Honors
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {achievements.filter(a => a.type === 'academic').map((honor) => (
              <Card key={honor.id}>
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h4 className="text-lg font-semibold text-text-primary">
                      {honor.title}
                    </h4>
                    <Badge variant="primary" size="sm">
                      {honor.date}
                    </Badge>
                  </div>
                  <p className="text-text-muted">
                    {honor.description}
                  </p>
                  {honor.details && (
                    <ul className="space-y-1">
                      {honor.details.map((detail, index) => (
                        <li key={index} className="text-text-muted text-sm flex items-start">
                          <span className="text-primary mr-2 mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
