import React from 'react'
import { motion } from 'framer-motion'
import { profile } from '@/data/profile'
import { projects } from '@/data/projects'
import { education, achievements } from '@/data/education'
import { activities } from '@/data/activities'
import { skillCategories } from '@/data/skills'
import { languages } from '@/data/languages'
import { contacts } from '@/data/contacts'
import { Button } from '@/components/ui/Button'
import { trackDownloadCV } from '@/lib/analytics'

export function Resume() {
  const academicHonors = achievements.filter(a => a.type === 'academic')
  const professionalAchievements = achievements.filter(a => a.type === 'professional')

  return (
    <div className="min-h-screen bg-background print:bg-white">
      {/* Print styles and download button */}
      <div className="no-print section-padding">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold text-text-primary mb-4">
              Resume
            </h1>
            <p className="text-text-muted mb-6">
              A comprehensive overview of my education, experience, and skills.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                as="a"
                href="/CV_Final.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackDownloadCV()}
                variant="primary"
              >
                Download PDF
              </Button>
              <Button
                onClick={() => window.print()}
                variant="secondary"
              >
                Print Page
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="max-w-4xl mx-auto p-8 print:p-0 print:max-w-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8 print:space-y-6"
        >
          {/* Header */}
          <header className="text-center border-b border-border print:border-gray-300 pb-6">
            <h1 className="text-4xl font-bold text-text-primary print:text-black mb-2">
              {profile.name}
            </h1>
            <p className="text-xl text-text-muted print:text-gray-600 mb-4">
              {profile.title}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-text-muted print:text-gray-600">
              <span>{profile.location}</span>
              <span>•</span>
              <span>{profile.email}</span>
              <span>•</span>
              <span>{profile.phone}</span>
              <span>•</span>
              <span>{profile.linkedin}</span>
              <span>•</span>
              <span>{profile.github}</span>
            </div>
          </header>

          {/* Summary */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary print:text-black mb-4 border-b border-border print:border-gray-300 pb-2">
              Professional Summary
            </h2>
            <p className="text-text-muted print:text-gray-700 leading-relaxed">
              {profile.summary}
            </p>
          </section>

          {/* Education */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary print:text-black mb-4 border-b border-border print:border-gray-300 pb-2">
              Education
            </h2>
            {education.map((edu) => (
              <div key={edu.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-semibold text-text-primary print:text-black">
                    {edu.degree}
                  </h3>
                  <span className="text-text-muted print:text-gray-600 text-sm">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </span>
                </div>
                <p className="text-text-muted print:text-gray-600 font-medium">
                  {edu.institution}, {edu.location}
                </p>
                {edu.description && (
                  <p className="text-text-muted print:text-gray-700 text-sm mt-2">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </section>

          {/* Projects */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary print:text-black mb-4 border-b border-border print:border-gray-300 pb-2">
              Key Projects
            </h2>
            {projects.map((project) => (
              <div key={project.id} className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-text-primary print:text-black">
                    {project.title}
                  </h3>
                  <span className="text-text-muted print:text-gray-600 text-sm">
                    {project.year}
                  </span>
                </div>
                <p className="text-text-muted print:text-gray-700 mb-2">
                  {project.description}
                </p>
                {project.highlights && (
                  <ul className="text-text-muted print:text-gray-700 text-sm space-y-1 mb-2">
                    {project.highlights.slice(0, 4).map((highlight, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 mt-1.5 w-1 h-1 rounded-full bg-current flex-shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}
                <p className="text-text-muted print:text-gray-600 text-sm">
                  <strong>Technologies:</strong> {project.tags.join(', ')}
                </p>
                {project.links.website && (
                  <p className="text-text-muted print:text-gray-600 text-sm">
                    <strong>Website:</strong> {project.links.website}
                  </p>
                )}
              </div>
            ))}
          </section>

          {/* Achievements */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary print:text-black mb-4 border-b border-border print:border-gray-300 pb-2">
              Achievements & Honors
            </h2>
            {[...academicHonors, ...professionalAchievements].map((achievement) => (
              <div key={achievement.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-semibold text-text-primary print:text-black">
                    {achievement.title}
                  </h3>
                  <span className="text-text-muted print:text-gray-600 text-sm">
                    {achievement.date}
                  </span>
                </div>
                <p className="text-text-muted print:text-gray-700 text-sm">
                  {achievement.description}
                </p>
              </div>
            ))}
          </section>

          {/* Skills */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary print:text-black mb-4 border-b border-border print:border-gray-300 pb-2">
              Technical Skills
            </h2>
            {skillCategories.map((category) => (
              <div key={category.name} className="mb-4">
                <h3 className="text-lg font-semibold text-text-primary print:text-black mb-2">
                  {category.name}
                </h3>
                <p className="text-text-muted print:text-gray-700 text-sm">
                  {category.skills.map(skill => skill.name).join(' • ')}
                </p>
              </div>
            ))}
          </section>

          {/* Languages */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary print:text-black mb-4 border-b border-border print:border-gray-300 pb-2">
              Languages
            </h2>
            {languages.map((language) => (
              <div key={language.name} className="mb-2">
                <span className="font-semibold text-text-primary print:text-black">
                  {language.name}:
                </span>
                <span className="text-text-muted print:text-gray-700 ml-2">
                  {language.level}
                  {language.certification && ` (${language.certification})`}
                </span>
              </div>
            ))}
          </section>

          {/* Activities */}
          <section>
            <h2 className="text-2xl font-bold text-text-primary print:text-black mb-4 border-b border-border print:border-gray-300 pb-2">
              Professional Activities
            </h2>
            {activities.slice(0, 3).map((activity) => (
              <div key={activity.id} className="mb-4">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-lg font-semibold text-text-primary print:text-black">
                    {activity.title}
                  </h3>
                  <span className="text-text-muted print:text-gray-600 text-sm">
                    {activity.date}
                  </span>
                </div>
                {activity.role && (
                  <p className="text-text-muted print:text-gray-600 text-sm font-medium">
                    {activity.role}
                  </p>
                )}
                <p className="text-text-muted print:text-gray-700 text-sm">
                  {activity.description}
                </p>
              </div>
            ))}
          </section>
        </motion.div>
      </div>
    </div>
  )
}
