import React from 'react'
import { motion } from 'framer-motion'
import { skillCategories } from '@/data/skills'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function Skills() {
  return (
    <div className="min-h-screen section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            title="Skills"
            subtitle="Technical Expertise"
            description="A comprehensive overview of my technical skills, programming languages, frameworks, tools, and specialized knowledge."
            centered
          />
        </motion.div>

        <div className="mt-16 space-y-12">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
            >
              <Card>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-text-primary">
                    {category.name}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.skills.map((skill, skillIndex) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.4, 
                          delay: categoryIndex * 0.1 + skillIndex * 0.05 
                        }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-text-primary">
                            {skill.name}
                          </h4>
                          {skill.level && (
                            <Badge
                              variant={
                                skill.level === 'expert' ? 'primary' :
                                skill.level === 'advanced' ? 'success' :
                                skill.level === 'intermediate' ? 'warning' :
                                'secondary'
                              }
                              size="sm"
                            >
                              {skill.level}
                            </Badge>
                          )}
                        </div>
                        
                        {skill.years && (
                          <p className="text-text-muted text-sm">
                            {skill.years} year{skill.years > 1 ? 's' : ''} experience
                          </p>
                        )}
                        
                        {skill.description && (
                          <p className="text-text-muted text-sm leading-relaxed">
                            {skill.description}
                          </p>
                        )}

                        {/* Progress bar for skill level */}
                        {skill.level && (
                          <div className="w-full bg-border rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-500 ${
                                skill.level === 'expert' ? 'w-full bg-primary' :
                                skill.level === 'advanced' ? 'w-4/5 bg-green-500' :
                                skill.level === 'intermediate' ? 'w-3/5 bg-yellow-500' :
                                'w-2/5 bg-secondary'
                              }`}
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
