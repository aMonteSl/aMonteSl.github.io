import React from 'react'
import { motion } from 'framer-motion'
import { languages } from '@/data/languages'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function Languages() {
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'native': return 'primary'
      case 'fluent': return 'success'
      case 'advanced': return 'success'
      case 'intermediate': return 'warning'
      case 'beginner': return 'secondary'
      default: return 'secondary'
    }
  }

  const getLevelWidth = (level: string) => {
    switch (level) {
      case 'native': return 'w-full'
      case 'fluent': return 'w-5/6'
      case 'advanced': return 'w-4/5'
      case 'intermediate': return 'w-3/5'
      case 'beginner': return 'w-2/5'
      default: return 'w-2/5'
    }
  }

  return (
    <div className="min-h-screen section-padding">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <SectionHeader
            title="Languages"
            subtitle="Communication Skills"
            description="My language proficiencies enabling effective communication in international and multicultural environments."
            centered
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {languages.map((language, index) => (
              <motion.div
                key={language.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-text-primary">
                        {language.name}
                      </h3>
                      <Badge 
                        variant={getLevelColor(language.level)} 
                        size="sm"
                      >
                        {language.level}
                      </Badge>
                    </div>

                    {language.certification && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-semibold text-text-primary">
                          Certification:
                        </h4>
                        <p className="text-text-muted text-sm">
                          {language.certification}
                        </p>
                      </div>
                    )}

                    {language.description && (
                      <p className="text-text-muted text-sm leading-relaxed">
                        {language.description}
                      </p>
                    )}

                    {/* Proficiency bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Proficiency</span>
                        <span className="text-primary font-medium capitalize">
                          {language.level}
                        </span>
                      </div>
                      <div className="w-full bg-border rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-700 ${
                            getLevelWidth(language.level)
                          } ${
                            language.level === 'native' ? 'bg-primary' :
                            language.level === 'fluent' || language.level === 'advanced' ? 'bg-green-500' :
                            language.level === 'intermediate' ? 'bg-yellow-500' :
                            'bg-secondary'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Language Skills Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 max-w-2xl mx-auto"
        >
          <Card>
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-text-primary">
                Communication Skills
              </h3>
              <p className="text-text-muted leading-relaxed">
                Comfortable working in multilingual environments with strong technical communication skills in both Spanish and English. 
                Experience with international collaboration and technical documentation.
              </p>
              <div className="flex justify-center gap-4 pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">2</div>
                  <div className="text-text-muted text-sm">Languages</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">B2</div>
                  <div className="text-text-muted text-sm">English Level</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
