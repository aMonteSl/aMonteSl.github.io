import type { IconType } from 'react-icons'
import type { SkillIconKey } from '@/content/skills'
import {
  FaCode,
  FaDatabase,
  FaCube,
  FaShieldAlt,
  FaRobot,
  FaBrain,
  FaCloud,
} from 'react-icons/fa'
import {
  SiC,
  SiCplusplus,
  SiPython,
  SiKotlin,
  SiTypescript,
  SiHtml5,
  SiJavascript,
  SiCss3,
  SiGo,
  SiDjango,
  SiExpress,
  SiReact,
  SiVite,
  SiTailwindcss,
  SiBootstrap,
  SiPostgresql,
  SiGit,
  SiLinux,
  SiAndroidstudio,
  SiWireshark,
  SiOpenssl,
  SiGithub,
  SiJira,
} from 'react-icons/si'
import { VscAzureDevops } from 'react-icons/vsc' 

const skillIconMap: Record<SkillIconKey, IconType> = {
  c: SiC,
  cplusplus: SiCplusplus,
  python: SiPython,
  kotlin: SiKotlin,
  typescript: SiTypescript,
  javascript: SiJavascript,
  html5: SiHtml5,
  css: SiCss3,
  go: SiGo,
  django: SiDjango,
  express: SiExpress,
  react: SiReact,
  vite: SiVite,
  tailwind: SiTailwindcss,
  bootstrap: SiBootstrap,
  postgresql: SiPostgresql,
  azure: FaCloud,
  azuredevops: VscAzureDevops,
  jira: SiJira,
  git: SiGit,
  linux: SiLinux,
  vscode: FaCode,
  androidStudio: SiAndroidstudio,
  wireshark: SiWireshark,
  openssl: SiOpenssl,
  github: SiGithub,
  sql: FaDatabase,
  xr: FaCube,
  security: FaShieldAlt,
  ai: FaBrain,
}

export function getSkillIcon(iconKey?: SkillIconKey): IconType {
  if (!iconKey) return FaCode
  return skillIconMap[iconKey] ?? FaCode
}

export const SKILL_FALLBACK_ICON = FaCode
export const SKILL_GENERIC_SECURITY_ICON = FaShieldAlt
export const SKILL_GENERIC_AI_ICON = FaRobot
