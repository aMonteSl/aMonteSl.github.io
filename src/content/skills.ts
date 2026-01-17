export type SkillId =
  | 'pascal'
  | 'c'
  | 'cpp'
  | 'riscv'
  | 'python'
  | 'kotlin'
  | 'jsTs'
  | 'htmlCss'
  | 'matlab'
  | 'go'
  | 'django'
  | 'express'
  | 'react'
  | 'vite'
  | 'tailwind'
  | 'bootstrap'
  | 'aframe'
  | 'babiaXr'
  | 'ros2'
  | 'sql'
  | 'postgresql'
  | 'azureCosmos'
  | 'azureBlob'
  | 'git'
  | 'linux'
  | 'vscode'
  | 'androidStudio'
  | 'wireshark'
  | 'nmap'
  | 'openssl'
  | 'gpg'
  | 'iptables'
  | 'ufw'
  | 'promptEngineering'
  | 'aiModels'
  | 'githubCopilot'

export type CategoryId =
  | 'languages'
  | 'backend'
  | 'frontend'
  | 'xrRobotics'
  | 'databasesCloud'
  | 'tools'
  | 'other'

export type ExperienceTagId =
  | 'academic'
  | 'internship'
  | 'open_source'
  | 'regular_use'
  | 'production_like'

export type ProficiencyLevel = 'basic' | 'intermediate' | 'advanced'

export type PurposeTagId =
  | 'learning'
  | 'academic'
  | 'internship'
  | 'open_source'
  | 'production_like'

export type SkillIconKey =
  | 'c'
  | 'cplusplus'
  | 'python'
  | 'kotlin'
  | 'typescript'
  | 'html5'
  | 'go'
  | 'django'
  | 'express'
  | 'react'
  | 'vite'
  | 'tailwind'
  | 'bootstrap'
  | 'postgresql'
  | 'azure'
  | 'git'
  | 'linux'
  | 'vscode'
  | 'androidStudio'
  | 'wireshark'
  | 'openssl'
  | 'github'
  | 'sql'
  | 'xr'
  | 'security'
  | 'ai'

export interface SkillUsedIn {
  id: string
  labelKey: string
  href: string
}

export interface SkillDetail {
  id: SkillId
  labelKey: string
  iconKey?: SkillIconKey
  experienceTags: ExperienceTagId[]
  proficiency: ProficiencyLevel
  purposeTag: PurposeTagId
  purposeKey: string
  summaryKey: string
  highlightsKeys: string[]
  usedIn: SkillUsedIn[]
}

export interface SkillCategory {
  id: CategoryId
  titleKey: string
  descriptionKey?: string
  skills: SkillId[]
}

const USED_IN = {
  projects: { id: 'projects', labelKey: 'usedIn.projects', href: '#projects' },
  journey: { id: 'journey', labelKey: 'usedIn.journey', href: '#journey' },
  codeXr: { id: 'code-xr', labelKey: 'usedIn.codeXr', href: '/projects/code-xr' },
} satisfies Record<string, SkillUsedIn>

export const SKILLS: Record<SkillId, SkillDetail> = {
  pascal: {
    id: 'pascal',
    labelKey: 'items.pascal.label',
    experienceTags: ['academic'],
    proficiency: 'basic',
    purposeTag: 'learning',
    purposeKey: 'items.pascal.purpose',
    summaryKey: 'items.pascal.summary',
    highlightsKeys: ['items.pascal.h1', 'items.pascal.h2'],
    usedIn: [USED_IN.journey],
  },
  c: {
    id: 'c',
    labelKey: 'items.c.label',
    iconKey: 'c',
    experienceTags: ['academic'],
    proficiency: 'intermediate',
    purposeTag: 'academic',
    purposeKey: 'items.c.purpose',
    summaryKey: 'items.c.summary',
    highlightsKeys: ['items.c.h1', 'items.c.h2'],
    usedIn: [USED_IN.projects],
  },
  cpp: {
    id: 'cpp',
    labelKey: 'items.cpp.label',
    iconKey: 'cplusplus',
    experienceTags: ['academic'],
    proficiency: 'intermediate',
    purposeTag: 'academic',
    purposeKey: 'items.cpp.purpose',
    summaryKey: 'items.cpp.summary',
    highlightsKeys: ['items.cpp.h1', 'items.cpp.h2'],
    usedIn: [USED_IN.projects],
  },
  riscv: {
    id: 'riscv',
    labelKey: 'items.riscv.label',
    experienceTags: ['academic'],
    proficiency: 'basic',
    purposeTag: 'academic',
    purposeKey: 'items.riscv.purpose',
    summaryKey: 'items.riscv.summary',
    highlightsKeys: ['items.riscv.h1', 'items.riscv.h2'],
    usedIn: [USED_IN.journey],
  },
  python: {
    id: 'python',
    labelKey: 'items.python.label',
    iconKey: 'python',
    experienceTags: ['academic', 'open_source', 'regular_use'],
    proficiency: 'advanced',
    purposeTag: 'open_source',
    purposeKey: 'items.python.purpose',
    summaryKey: 'items.python.summary',
    highlightsKeys: ['items.python.h1', 'items.python.h2'],
    usedIn: [USED_IN.codeXr, USED_IN.projects],
  },
  kotlin: {
    id: 'kotlin',
    labelKey: 'items.kotlin.label',
    iconKey: 'kotlin',
    experienceTags: ['academic'],
    proficiency: 'basic',
    purposeTag: 'academic',
    purposeKey: 'items.kotlin.purpose',
    summaryKey: 'items.kotlin.summary',
    highlightsKeys: ['items.kotlin.h1', 'items.kotlin.h2'],
    usedIn: [USED_IN.projects],
  },
  jsTs: {
    id: 'jsTs',
    labelKey: 'items.jsTs.label',
    iconKey: 'typescript',
    experienceTags: ['open_source', 'regular_use'],
    proficiency: 'advanced',
    purposeTag: 'open_source',
    purposeKey: 'items.jsTs.purpose',
    summaryKey: 'items.jsTs.summary',
    highlightsKeys: ['items.jsTs.h1', 'items.jsTs.h2'],
    usedIn: [USED_IN.codeXr, USED_IN.projects],
  },
  htmlCss: {
    id: 'htmlCss',
    labelKey: 'items.htmlCss.label',
    iconKey: 'html5',
    experienceTags: ['regular_use'],
    proficiency: 'intermediate',
    purposeTag: 'production_like',
    purposeKey: 'items.htmlCss.purpose',
    summaryKey: 'items.htmlCss.summary',
    highlightsKeys: ['items.htmlCss.h1', 'items.htmlCss.h2'],
    usedIn: [USED_IN.projects],
  },
  matlab: {
    id: 'matlab',
    labelKey: 'items.matlab.label',
    experienceTags: ['academic'],
    proficiency: 'basic',
    purposeTag: 'academic',
    purposeKey: 'items.matlab.purpose',
    summaryKey: 'items.matlab.summary',
    highlightsKeys: ['items.matlab.h1', 'items.matlab.h2'],
    usedIn: [USED_IN.journey],
  },
  go: {
    id: 'go',
    labelKey: 'items.go.label',
    iconKey: 'go',
    experienceTags: ['academic'],
    proficiency: 'basic',
    purposeTag: 'learning',
    purposeKey: 'items.go.purpose',
    summaryKey: 'items.go.summary',
    highlightsKeys: ['items.go.h1', 'items.go.h2'],
    usedIn: [USED_IN.projects],
  },
  django: {
    id: 'django',
    labelKey: 'items.django.label',
    iconKey: 'django',
    experienceTags: ['academic', 'regular_use'],
    proficiency: 'intermediate',
    purposeTag: 'academic',
    purposeKey: 'items.django.purpose',
    summaryKey: 'items.django.summary',
    highlightsKeys: ['items.django.h1', 'items.django.h2'],
    usedIn: [USED_IN.projects],
  },
  express: {
    id: 'express',
    labelKey: 'items.express.label',
    iconKey: 'express',
    experienceTags: ['regular_use', 'open_source'],
    proficiency: 'intermediate',
    purposeTag: 'open_source',
    purposeKey: 'items.express.purpose',
    summaryKey: 'items.express.summary',
    highlightsKeys: ['items.express.h1', 'items.express.h2'],
    usedIn: [USED_IN.projects],
  },
  react: {
    id: 'react',
    labelKey: 'items.react.label',
    iconKey: 'react',
    experienceTags: ['open_source', 'regular_use'],
    proficiency: 'advanced',
    purposeTag: 'open_source',
    purposeKey: 'items.react.purpose',
    summaryKey: 'items.react.summary',
    highlightsKeys: ['items.react.h1', 'items.react.h2'],
    usedIn: [USED_IN.codeXr, USED_IN.projects],
  },
  vite: {
    id: 'vite',
    labelKey: 'items.vite.label',
    iconKey: 'vite',
    experienceTags: ['regular_use'],
    proficiency: 'intermediate',
    purposeTag: 'production_like',
    purposeKey: 'items.vite.purpose',
    summaryKey: 'items.vite.summary',
    highlightsKeys: ['items.vite.h1', 'items.vite.h2'],
    usedIn: [USED_IN.projects],
  },
  tailwind: {
    id: 'tailwind',
    labelKey: 'items.tailwind.label',
    iconKey: 'tailwind',
    experienceTags: ['regular_use'],
    proficiency: 'intermediate',
    purposeTag: 'production_like',
    purposeKey: 'items.tailwind.purpose',
    summaryKey: 'items.tailwind.summary',
    highlightsKeys: ['items.tailwind.h1', 'items.tailwind.h2'],
    usedIn: [USED_IN.projects],
  },
  bootstrap: {
    id: 'bootstrap',
    labelKey: 'items.bootstrap.label',
    iconKey: 'bootstrap',
    experienceTags: ['academic'],
    proficiency: 'basic',
    purposeTag: 'academic',
    purposeKey: 'items.bootstrap.purpose',
    summaryKey: 'items.bootstrap.summary',
    highlightsKeys: ['items.bootstrap.h1', 'items.bootstrap.h2'],
    usedIn: [USED_IN.projects],
  },
  aframe: {
    id: 'aframe',
    labelKey: 'items.aframe.label',
    iconKey: 'xr',
    experienceTags: ['academic', 'open_source'],
    proficiency: 'intermediate',
    purposeTag: 'open_source',
    purposeKey: 'items.aframe.purpose',
    summaryKey: 'items.aframe.summary',
    highlightsKeys: ['items.aframe.h1', 'items.aframe.h2'],
    usedIn: [USED_IN.codeXr],
  },
  babiaXr: {
    id: 'babiaXr',
    labelKey: 'items.babiaXr.label',
    iconKey: 'xr',
    experienceTags: ['open_source'],
    proficiency: 'intermediate',
    purposeTag: 'open_source',
    purposeKey: 'items.babiaXr.purpose',
    summaryKey: 'items.babiaXr.summary',
    highlightsKeys: ['items.babiaXr.h1', 'items.babiaXr.h2'],
    usedIn: [USED_IN.codeXr],
  },
  ros2: {
    id: 'ros2',
    labelKey: 'items.ros2.label',
    iconKey: 'xr',
    experienceTags: ['academic'],
    proficiency: 'basic',
    purposeTag: 'academic',
    purposeKey: 'items.ros2.purpose',
    summaryKey: 'items.ros2.summary',
    highlightsKeys: ['items.ros2.h1', 'items.ros2.h2'],
    usedIn: [USED_IN.journey],
  },
  sql: {
    id: 'sql',
    labelKey: 'items.sql.label',
    iconKey: 'sql',
    experienceTags: ['academic', 'regular_use'],
    proficiency: 'intermediate',
    purposeTag: 'academic',
    purposeKey: 'items.sql.purpose',
    summaryKey: 'items.sql.summary',
    highlightsKeys: ['items.sql.h1', 'items.sql.h2'],
    usedIn: [USED_IN.projects],
  },
  postgresql: {
    id: 'postgresql',
    labelKey: 'items.postgresql.label',
    iconKey: 'postgresql',
    experienceTags: ['regular_use'],
    proficiency: 'intermediate',
    purposeTag: 'production_like',
    purposeKey: 'items.postgresql.purpose',
    summaryKey: 'items.postgresql.summary',
    highlightsKeys: ['items.postgresql.h1', 'items.postgresql.h2'],
    usedIn: [USED_IN.projects],
  },
  azureCosmos: {
    id: 'azureCosmos',
    labelKey: 'items.azureCosmos.label',
    iconKey: 'azure',
    experienceTags: ['academic'],
    proficiency: 'basic',
    purposeTag: 'academic',
    purposeKey: 'items.azureCosmos.purpose',
    summaryKey: 'items.azureCosmos.summary',
    highlightsKeys: ['items.azureCosmos.h1', 'items.azureCosmos.h2'],
    usedIn: [USED_IN.projects],
  },
  azureBlob: {
    id: 'azureBlob',
    labelKey: 'items.azureBlob.label',
    iconKey: 'azure',
    experienceTags: ['academic'],
    proficiency: 'basic',
    purposeTag: 'academic',
    purposeKey: 'items.azureBlob.purpose',
    summaryKey: 'items.azureBlob.summary',
    highlightsKeys: ['items.azureBlob.h1', 'items.azureBlob.h2'],
    usedIn: [USED_IN.projects],
  },
  git: {
    id: 'git',
    labelKey: 'items.git.label',
    iconKey: 'git',
    experienceTags: ['regular_use'],
    proficiency: 'advanced',
    purposeTag: 'production_like',
    purposeKey: 'items.git.purpose',
    summaryKey: 'items.git.summary',
    highlightsKeys: ['items.git.h1', 'items.git.h2'],
    usedIn: [USED_IN.projects],
  },
  linux: {
    id: 'linux',
    labelKey: 'items.linux.label',
    iconKey: 'linux',
    experienceTags: ['regular_use'],
    proficiency: 'advanced',
    purposeTag: 'production_like',
    purposeKey: 'items.linux.purpose',
    summaryKey: 'items.linux.summary',
    highlightsKeys: ['items.linux.h1', 'items.linux.h2'],
    usedIn: [USED_IN.projects],
  },
  vscode: {
    id: 'vscode',
    labelKey: 'items.vscode.label',
    iconKey: 'vscode',
    experienceTags: ['regular_use'],
    proficiency: 'advanced',
    purposeTag: 'production_like',
    purposeKey: 'items.vscode.purpose',
    summaryKey: 'items.vscode.summary',
    highlightsKeys: ['items.vscode.h1', 'items.vscode.h2'],
    usedIn: [USED_IN.projects],
  },
  androidStudio: {
    id: 'androidStudio',
    labelKey: 'items.androidStudio.label',
    iconKey: 'androidStudio',
    experienceTags: ['academic'],
    proficiency: 'basic',
    purposeTag: 'academic',
    purposeKey: 'items.androidStudio.purpose',
    summaryKey: 'items.androidStudio.summary',
    highlightsKeys: ['items.androidStudio.h1', 'items.androidStudio.h2'],
    usedIn: [USED_IN.projects],
  },
  wireshark: {
    id: 'wireshark',
    labelKey: 'items.wireshark.label',
    iconKey: 'wireshark',
    experienceTags: ['academic', 'regular_use'],
    proficiency: 'intermediate',
    purposeTag: 'academic',
    purposeKey: 'items.wireshark.purpose',
    summaryKey: 'items.wireshark.summary',
    highlightsKeys: ['items.wireshark.h1', 'items.wireshark.h2'],
    usedIn: [USED_IN.journey],
  },
  nmap: {
    id: 'nmap',
    labelKey: 'items.nmap.label',
    iconKey: 'security',
    experienceTags: ['academic'],
    proficiency: 'basic',
    purposeTag: 'academic',
    purposeKey: 'items.nmap.purpose',
    summaryKey: 'items.nmap.summary',
    highlightsKeys: ['items.nmap.h1', 'items.nmap.h2'],
    usedIn: [USED_IN.journey],
  },
  openssl: {
    id: 'openssl',
    labelKey: 'items.openssl.label',
    iconKey: 'openssl',
    experienceTags: ['academic'],
    proficiency: 'basic',
    purposeTag: 'academic',
    purposeKey: 'items.openssl.purpose',
    summaryKey: 'items.openssl.summary',
    highlightsKeys: ['items.openssl.h1', 'items.openssl.h2'],
    usedIn: [USED_IN.projects],
  },
  gpg: {
    id: 'gpg',
    labelKey: 'items.gpg.label',
    iconKey: 'security',
    experienceTags: ['academic'],
    proficiency: 'basic',
    purposeTag: 'academic',
    purposeKey: 'items.gpg.purpose',
    summaryKey: 'items.gpg.summary',
    highlightsKeys: ['items.gpg.h1', 'items.gpg.h2'],
    usedIn: [USED_IN.projects],
  },
  iptables: {
    id: 'iptables',
    labelKey: 'items.iptables.label',
    iconKey: 'security',
    experienceTags: ['academic'],
    proficiency: 'basic',
    purposeTag: 'academic',
    purposeKey: 'items.iptables.purpose',
    summaryKey: 'items.iptables.summary',
    highlightsKeys: ['items.iptables.h1', 'items.iptables.h2'],
    usedIn: [USED_IN.journey],
  },
  ufw: {
    id: 'ufw',
    labelKey: 'items.ufw.label',
    iconKey: 'security',
    experienceTags: ['academic'],
    proficiency: 'basic',
    purposeTag: 'academic',
    purposeKey: 'items.ufw.purpose',
    summaryKey: 'items.ufw.summary',
    highlightsKeys: ['items.ufw.h1', 'items.ufw.h2'],
    usedIn: [USED_IN.journey],
  },
  promptEngineering: {
    id: 'promptEngineering',
    labelKey: 'items.promptEngineering.label',
    iconKey: 'ai',
    experienceTags: ['regular_use'],
    proficiency: 'intermediate',
    purposeTag: 'production_like',
    purposeKey: 'items.promptEngineering.purpose',
    summaryKey: 'items.promptEngineering.summary',
    highlightsKeys: ['items.promptEngineering.h1', 'items.promptEngineering.h2'],
    usedIn: [USED_IN.projects],
  },
  aiModels: {
    id: 'aiModels',
    labelKey: 'items.aiModels.label',
    iconKey: 'ai',
    experienceTags: ['regular_use'],
    proficiency: 'intermediate',
    purposeTag: 'production_like',
    purposeKey: 'items.aiModels.purpose',
    summaryKey: 'items.aiModels.summary',
    highlightsKeys: ['items.aiModels.h1', 'items.aiModels.h2'],
    usedIn: [USED_IN.projects],
  },
  githubCopilot: {
    id: 'githubCopilot',
    labelKey: 'items.githubCopilot.label',
    iconKey: 'github',
    experienceTags: ['regular_use'],
    proficiency: 'intermediate',
    purposeTag: 'production_like',
    purposeKey: 'items.githubCopilot.purpose',
    summaryKey: 'items.githubCopilot.summary',
    highlightsKeys: ['items.githubCopilot.h1', 'items.githubCopilot.h2'],
    usedIn: [USED_IN.projects],
  },
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    id: 'languages',
    titleKey: 'categories.languages.label',
    descriptionKey: 'categories.languages.desc',
    skills: ['pascal', 'c', 'cpp', 'riscv', 'python', 'kotlin', 'jsTs', 'htmlCss', 'matlab', 'go'],
  },
  {
    id: 'backend',
    titleKey: 'categories.backend.label',
    descriptionKey: 'categories.backend.desc',
    skills: ['django', 'express'],
  },
  {
    id: 'frontend',
    titleKey: 'categories.frontend.label',
    descriptionKey: 'categories.frontend.desc',
    skills: ['react', 'vite', 'tailwind', 'bootstrap'],
  },
  {
    id: 'xrRobotics',
    titleKey: 'categories.xrRobotics.label',
    descriptionKey: 'categories.xrRobotics.desc',
    skills: ['aframe', 'babiaXr', 'ros2'],
  },
  {
    id: 'databasesCloud',
    titleKey: 'categories.databasesCloud.label',
    descriptionKey: 'categories.databasesCloud.desc',
    skills: ['sql', 'postgresql', 'azureCosmos', 'azureBlob'],
  },
  {
    id: 'tools',
    titleKey: 'categories.tools.label',
    descriptionKey: 'categories.tools.desc',
    skills: ['git', 'linux', 'vscode', 'androidStudio', 'wireshark', 'nmap', 'openssl', 'gpg', 'iptables', 'ufw'],
  },
  {
    id: 'other',
    titleKey: 'categories.other.label',
    descriptionKey: 'categories.other.desc',
    skills: ['promptEngineering', 'aiModels', 'githubCopilot'],
  },
]
