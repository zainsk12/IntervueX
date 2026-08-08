import type { RouteDefinition } from '../types/routes'

export const ROUTES = {
  LANDING: '/',
  INTERVIEW_SETUP: '/interview/setup',
  INTERVIEW: '/interview',
  RESULTS: '/results',
  EVIDENCE: '/evidence',
} as const

export const APP_ROUTES: RouteDefinition[] = [
  {
    path: ROUTES.LANDING,
    label: 'Landing',
    description: 'Product entry and interview initiation.',
  },
  {
    path: ROUTES.INTERVIEW_SETUP,
    label: 'Candidate Setup',
    description: 'Profile intake and session preparation.',
  },
  {
    path: ROUTES.INTERVIEW,
    label: 'Interview Workspace',
    description: 'Adaptive technical interview environment.',
  },
  {
    path: ROUTES.RESULTS,
    label: 'Results',
    description: 'Evidence-backed assessment summary.',
  },
  {
    path: ROUTES.EVIDENCE,
    label: 'Evidence',
    description: 'Dynamic evidence exploration.',
  },
]
