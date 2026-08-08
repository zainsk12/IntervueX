import type { EvidenceLogEntry, FocusArea } from './interview'

/**
 * Reflects how much of the planned interview has captured evidence — not a
 * quality verdict. There is no scoring/evaluation model in this frontend
 * build, so assessment status is derived purely from evidence coverage.
 */
export type AssessmentStatus = 'no-evidence' | 'incomplete' | 'complete'

export interface CompetencyAssessment {
  competency: string
  focusArea: FocusArea
  meta: string
  records: EvidenceLogEntry[]
}

export interface AssessmentSummary {
  status: AssessmentStatus
  capturedCount: number
  pendingCount: number
  totalQuestions: number
  competencies: CompetencyAssessment[]
  /** Focus areas with at least one captured evidence record. */
  evidencedFocusAreas: FocusArea[]
  /** Candidate-selected focus areas with no captured evidence yet. */
  followUpFocusAreas: FocusArea[]
}