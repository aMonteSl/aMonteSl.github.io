'use client'

import type { IconType } from 'react-icons'
import { FaCode, FaCloud } from 'react-icons/fa'
import {
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiJavascript,
  SiPython,
  SiPostgresql,
  SiRedis,
  SiNextdotjs,
  SiExpress,
  SiAframe,
  SiLeaflet,
  SiNestjs,
  SiSwagger,
} from 'react-icons/si'
import { TbBrandSocketIo, TbHexagonLetterA } from 'react-icons/tb'
import { DiJava } from 'react-icons/di'
import { BsDatabase, BsCpu, BsHddNetwork } from 'react-icons/bs'
import { VscVscode } from 'react-icons/vsc'

/**
 * Map of tech names (lowercase) to their icons
 * Uses website accent color for all icons for cohesive look
 */
const techIconMap: Record<string, IconType> = {
  // Languages
  react: SiReact,
  'react.js': SiReact,
  'node.js': SiNodedotjs,
  nodejs: SiNodedotjs,
  typescript: SiTypescript,
  javascript: SiJavascript,
  python: SiPython,
  java: DiJava,

  // Frameworks
  'next.js': SiNextdotjs,
  nextjs: SiNextdotjs,
  'nest.js': SiNestjs,
  nestjs: SiNestjs,
  express: SiExpress,
  'a-frame': SiAframe,
  aframe: SiAframe,

  // Libraries
  'babia-xr': TbHexagonLetterA,
  babiaxr: TbHexagonLetterA,
  leaflet: SiLeaflet,
  websocket: TbBrandSocketIo,

  // Databases
  postgresql: SiPostgresql,
  postgres: SiPostgresql,
  redis: SiRedis,
  'cosmosdb': FaCloud,
  'azure cosmosdb': FaCloud,
  'azure blob storage': FaCloud,

  // Tools
  'vs code api': VscVscode,
  'vscode api': VscVscode,
  'vs code extension': VscVscode,
  'vs code extension api': VscVscode,
  swagger: SiSwagger,
  jwt: BsDatabase,
  tsdoc: FaCode,
  webxr: BsCpu,
  json: BsDatabase,
  vite: FaCode,
  tailwind: FaCode,
  'tailwind css': FaCode,

  // Academic / Generic
  algorithms: BsCpu,
  'clean architecture': FaCode,
  'data structures': BsDatabase,
  networking: BsHddNetwork,
  systems: BsCpu,
  'c/c++': FaCode,
}

/**
 * Get the icon for a tech name
 * Returns FaCode as fallback for unknown techs
 */
function getTechIcon(tech: string): IconType {
  const key = tech.toLowerCase()
  return techIconMap[key] ?? FaCode
}

interface TechTagProps {
  tech: string
  className?: string
}

/**
 * Renders a tech tag with icon above and text below
 * Uses website colors for cohesive integration
 */
export function TechTag({ tech, className = '' }: TechTagProps) {
  const Icon = getTechIcon(tech)

  return (
    <div
      className={`
        flex flex-col items-center gap-1 px-2 py-1.5
        rounded-lg bg-[var(--card)]/60 
        border border-[var(--border)]/40
        transition-all duration-200
        hover:border-[var(--accent)]/40 hover:bg-[var(--card)]/80
        group
        ${className}
      `}
      title={tech}
    >
      <Icon
        className="w-4 h-4 text-[var(--accent)] opacity-80 group-hover:opacity-100 transition-opacity"
        aria-hidden="true"
      />
      <span className="text-[10px] text-[var(--fg-muted)] leading-none whitespace-nowrap group-hover:text-[var(--fg)] transition-colors">
        {tech}
      </span>
    </div>
  )
}

/**
 * Export the icon map for potential reuse
 */
export { techIconMap, getTechIcon }
