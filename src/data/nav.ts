export interface NavSection {
  id: string
  label: string
  href: string
}

export const navSections: NavSection[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'education', label: 'Education', href: '#education' },
  { id: 'activities', label: 'Activities', href: '#activities' },
  { id: 'skills', label: 'Skills', href: '#skills' },
  { id: 'languages', label: 'Languages', href: '#languages' },
  { id: 'images', label: 'Images', href: '#images' },
  { id: 'contact', label: 'Contact', href: '#contact' },
  { id: 'resume', label: 'Resume', href: '#resume' },
]

export const sectionIds = navSections.map(section => section.id)
