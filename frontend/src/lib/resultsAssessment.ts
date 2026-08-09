import type { CandidateSetupPayload, EvidenceLogEntry } from '../types/interview'
import type { AssessmentSummary, AssessmentStatus, CompetencyAssessment } from '../types/results'

/**
 * Derives an evidence-coverage summary from the real session's evidence
 * log. `isComplete` reflects the backend's `done` flag (i.e. whether final
 * feedback has been generated) — completion is no longer inferred from a
 * local static question count, since the real backend interview length is
 * adaptive rather than fixed.
 */
export function buildAssessmentSummary(
  setup: CandidateSetupPayload,
  evidenceLog: EvidenceLogEntry[],
  isComplete: boolean,
): AssessmentSummary {
  const totalQuestions = evidenceLog.length
  const capturedRecords = evidenceLog.filter((record) => record.status === 'captured')
  const pendingCount = evidenceLog.filter((record) => record.status === 'pending').length
  const capturedCount = capturedRecords.length

  let status: AssessmentStatus = 'no-evidence'
  if (capturedCount > 0) {
    status = isComplete ? 'complete' : 'incomplete'
  }

  const byCompetency = new Map<string, CompetencyAssessment>()
  for (const record of capturedRecords) {
    const existing = byCompetency.get(record.competency)
    if (existing) {
      existing.records.push(record)
    } else {
      byCompetency.set(record.competency, {
        competency: record.competency,
        focusArea: record.focusArea,
        meta: record.meta,
        records: [record],
      })
    }
  }
  const competencies = Array.from(byCompetency.values()).sort((a, b) =>
    a.competency.localeCompare(b.competency),
  )

  const evidencedFocusAreas = Array.from(new Set(capturedRecords.map((record) => record.focusArea)))
  const followUpFocusAreas = setup.context.focusAreas.filter(
    (focusArea) => !evidencedFocusAreas.includes(focusArea),
  )

  return {
    status,
    capturedCount,
    pendingCount,
    totalQuestions,
    competencies,
    evidencedFocusAreas,
    followUpFocusAreas,
  }
}
