import { ArrowRight, Brain, ClipboardCheck, FileSearch, ScanSearch, UserRound } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const LANDING_NAV = [
  { id: 'approach', label: 'Approach' },
  { id: 'how-it-works', label: 'How it works' },
] as const

export const EVIDENCE_FLOW_STAGES = [
  {
    id: 'candidate',
    label: 'Candidate',
    meta: 'PROFILE.HYP',
    title: 'Initial hypothesis',
    detail: 'RAG → Strong · System Design → Moderate',
    status: 'baseline',
  },
  {
    id: 'question',
    label: 'Question',
    meta: 'Q-0847',
    title: 'Adaptive probe',
    detail: 'Diagnose retrieval failure in a production RAG pipeline.',
    status: 'active',
  },
  {
    id: 'response',
    label: 'Response',
    meta: 'RSP-0847',
    title: 'Candidate evidence',
    detail: 'Identifies chunk overlap issue; misses reranker latency tradeoff.',
    status: 'neutral',
  },
  {
    id: 'evidence',
    label: 'Evidence',
    meta: 'E-0042',
    title: 'Signal extracted',
    detail: 'Partial retrieval diagnosis · Gap: latency reasoning',
    status: 'evidence',
  },
  {
    id: 'assessment',
    label: 'Assessment',
    meta: 'CMP-RAG',
    title: 'Model updated',
    detail: 'RAG → Moderate · Probe depth increased',
    status: 'updated',
  },
] as const

export const TRADITIONAL_STEPS = [
  { id: 'q1', label: 'Q1', text: 'Explain REST vs GraphQL' },
  { id: 'q2', label: 'Q2', text: 'Describe your last project' },
  { id: 'q3', label: 'Q3', text: 'What is a binary search tree?' },
  { id: 'q4', label: 'Q4', text: 'System design: URL shortener' },
] as const

export const ADAPTIVE_STEPS = [
  { id: 'a1', label: 'Probe', text: 'RAG failure diagnosis', evidence: 'E-0042' },
  { id: 'a2', label: 'Follow-up', text: 'Reranker latency tradeoffs', evidence: 'E-0043' },
  { id: 'a3', label: 'Verify', text: 'Chunking strategy under load', evidence: 'E-0044' },
] as const

export interface HowItWorksStep {
  id: string
  step: string
  title: string
  description: string
  icon: LucideIcon
}

export const HOW_IT_WORKS: HowItWorksStep[] = [
  {
    id: 'profile',
    step: '01',
    title: 'Candidate Profile',
    description: 'Resume and role context form an initial competency hypothesis—not a verdict.',
    icon: UserRound,
  },
  {
    id: 'initial',
    step: '02',
    title: 'Initial Assessment',
    description: 'IntervueX maps starting signals and identifies topics that require verification.',
    icon: FileSearch,
  },
  {
    id: 'adaptive',
    step: '03',
    title: 'Adaptive Interview',
    description: 'Questions shift based on demonstrated knowledge, not a predetermined script.',
    icon: Brain,
  },
  {
    id: 'collection',
    step: '04',
    title: 'Evidence Collection',
    description: 'Each response is evaluated as structured evidence with confidence markers.',
    icon: ScanSearch,
  },
  {
    id: 'competency',
    step: '05',
    title: 'Competency Assessment',
    description: 'Final ratings reflect what was proven during the interview, not what was claimed.',
    icon: ClipboardCheck,
  },
]

export const DIFFERENTIATION_POINTS = [
  {
    id: 'fixed',
    heading: 'Traditional interviews',
    summary: 'Follow a fixed question list regardless of what the candidate demonstrates.',
    traits: [
      'Same sequence for every candidate',
      'Resume claims treated as ground truth',
      'Gaps discovered too late—or not at all',
    ],
  },
  {
    id: 'adaptive',
    heading: 'IntervueX',
    summary: 'Adapts the interview path as evidence accumulates in real time.',
    traits: [
      'Questions respond to demonstrated knowledge',
      'Competency model updates after each response',
      'Probing depth follows evidence gaps',
    ],
  },
] as const

export { ArrowRight }
