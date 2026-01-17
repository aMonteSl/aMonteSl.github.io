'use client'

import { motion } from 'framer-motion'
import { FaExternalLinkAlt } from 'react-icons/fa'
import type { IconType } from 'react-icons'
import type { ProficiencyLevel } from '@/content/skills'
import { cn } from '@/lib/utils'
import { ProficiencyDots } from './ProficiencyDots'

export interface ShowcaseSkillChipProps {
  label: string
  icon?: IconType
  proficiency?: ProficiencyLevel
  isActive?: boolean
  onClick?: () => void
  className?: string
}

export function ShowcaseSkillChip({
  label,
  icon: Icon,
  proficiency,
  isActive,
  onClick,
  className,
}: ShowcaseSkillChipProps) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        'relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
        'border border-white/20 bg-white/5 text-white/80 cursor-pointer',
        'hover:bg-white/10 hover:text-white hover:shadow-lg hover:shadow-white/10',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent',
        isActive && 'bg-white/15 border-white/40 text-white shadow-lg shadow-white/20',
        className
      )}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      {/* Tech icon */}
      {Icon && <Icon className="w-4 h-4 flex-shrink-0 opacity-90" />}

      {/* Label */}
      <span>{label}</span>

      {/* Proficiency indicator (dots) */}
      {proficiency && <ProficiencyDots level={proficiency} className="ml-1" />}

      {/* Open affordance indicator (shown on hover) */}
      <motion.div
        className="absolute right-2 top-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.8 }}
        whileHover={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.15 }}
      >
        <FaExternalLinkAlt className="w-3 h-3 text-white/60" />
      </motion.div>
    </motion.button>
  )
}
