/**
 * Public recommendation summaries.
 * The original PDFs are intentionally not exposed as downloadable assets.
 */

export type RecommendationType = 'academic' | 'professional' | 'formal'

export interface Recommendation {
  id: 'vbgroup-abner' | 'david-moreno' | 'vbgroup-formal'
  name: string
  roleKey: string
  organization: string
  relationshipKey: string
  date: string
  type: RecommendationType
  summaryKey: string
  strengthKeys: string[]
}

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'vbgroup-abner',
    name: 'Abner Alejandro Magaña H.',
    roleKey: 'recommendations.vbgroup-abner.role',
    organization: 'VB Group',
    relationshipKey: 'recommendations.vbgroup-abner.relationship',
    date: 'Jan 2026',
    type: 'professional',
    summaryKey: 'recommendations.vbgroup-abner.summary',
    strengthKeys: [
      'recommendations.vbgroup-abner.strengths.backend',
      'recommendations.vbgroup-abner.strengths.cloud',
      'recommendations.vbgroup-abner.strengths.autonomy',
      'recommendations.vbgroup-abner.strengths.attitude',
    ],
  },
  {
    id: 'david-moreno',
    name: 'David Moreno Lumbreras',
    roleKey: 'recommendations.david-moreno.role',
    organization: 'Universidad Rey Juan Carlos',
    relationshipKey: 'recommendations.david-moreno.relationship',
    date: 'Jul 2025',
    type: 'academic',
    summaryKey: 'recommendations.david-moreno.summary',
    strengthKeys: [
      'recommendations.david-moreno.strengths.autonomy',
      'recommendations.david-moreno.strengths.method',
      'recommendations.david-moreno.strengths.communication',
      'recommendations.david-moreno.strengths.collaboration',
    ],
  },
  {
    id: 'vbgroup-formal',
    name: 'VB Group',
    roleKey: 'recommendations.vbgroup-formal.role',
    organization: 'VB Group S.L.',
    relationshipKey: 'recommendations.vbgroup-formal.relationship',
    date: 'Jan 2026',
    type: 'formal',
    summaryKey: 'recommendations.vbgroup-formal.summary',
    strengthKeys: [
      'recommendations.vbgroup-formal.strengths.commitment',
      'recommendations.vbgroup-formal.strengths.it',
      'recommendations.vbgroup-formal.strengths.reference',
    ],
  },
]
