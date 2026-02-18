// Uses page content - tools, software, and hardware
export type UsesCategory = 'editor' | 'terminal' | 'devTools' | 'design' | 'hardware' | 'browser'

export interface UsesItem {
  id: string
  category: UsesCategory
  url?: string
}

export const USES_ITEMS: UsesItem[] = [
  // Editor & IDE
  { id: 'vscode', category: 'editor', url: 'https://code.visualstudio.com' },
  { id: 'copilot', category: 'editor', url: 'https://github.com/features/copilot' },

  // Terminal & Shell
  { id: 'windowsTerminal', category: 'terminal', url: 'https://github.com/microsoft/terminal' },
  { id: 'git', category: 'terminal', url: 'https://git-scm.com' },

  // Development Tools
  { id: 'node', category: 'devTools', url: 'https://nodejs.org' },
  { id: 'docker', category: 'devTools', url: 'https://www.docker.com' },
  { id: 'postman', category: 'devTools', url: 'https://www.postman.com' },

  // Design & Productivity
  { id: 'figma', category: 'design', url: 'https://www.figma.com' },
  { id: 'notion', category: 'design', url: 'https://www.notion.so' },
  { id: 'obsidian', category: 'design', url: 'https://obsidian.md' },

  // Hardware
  { id: 'dellMonitor', category: 'hardware' },
  { id: 'keyboard', category: 'hardware' },

  // Browser & Extensions
  { id: 'chrome', category: 'browser', url: 'https://www.google.com/chrome' },
  { id: 'reactDevtools', category: 'browser', url: 'https://react.dev/learn/react-developer-tools' },
]

export const USES_CATEGORIES: UsesCategory[] = ['editor', 'terminal', 'devTools', 'design', 'hardware', 'browser']
