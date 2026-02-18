/**
 * Testimonials and Recommendations
 * Quotes from colleagues, mentors, and collaborators
 */

export interface Testimonial {
  id: string
  name: string
  role: string
  organization?: string
  quote: string // i18n key
  avatar?: string
  link?: string // LinkedIn or website
  type: 'colleague' | 'mentor' | 'manager' | 'client'
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'mentor-1',
    name: 'Pending',
    role: 'Mentor',
    quote: 'testimonials.pending',
    type: 'mentor',
  },
  // Add testimonials from colleagues, managers, clients as they come in
  // Format:
  // {
  //   id: 'vbgroup-manager',
  //   name: 'John Doe',
  //   role: 'Tech Lead',
  //   organization: 'VBGroup',
  //   quote: 'testimonials.vbgroupManager',
  //   link: 'https://linkedin.com/in/johndoe',
  //   type: 'manager',
  // }
]
