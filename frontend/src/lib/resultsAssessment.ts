import { buildInterviewQueue } from './buildInterviewQueue'
import type { CandidateSetupPayload, EvidenceLogEntry } from '../types/interview'
import type { AssessmentSummary, AssessmentStatus, CompetencyAssessment } from '../types/results'

/**
 * Derives an evidence-coverage assessment from the existing session/evidence
 * state. This is intentionally NOT a scoring or grading model — there is no
 * response-evaluation logic in this frontend build, so nothing here judges
 * response quality. It only reports what evidence exists and where it does
 * not, so the Results page can never present a fabricated score.
 */
export function buildAssessmentSummary(
  setup: CandidateSetupPayload,
  evidenceLog: EvidenceLogEntry[],
): AssessmentSummary {
  const totalQuestions = buildInterviewQueue(setup).length
  const capturedRecords = evidenceLog.filter((record) => record.status === 'captured')
  const pendingCount = evidenceLog.filter((record) => record.status === 'pending').length
  const capturedCount = capturedRecords.length

  let status: AssessmentStatus = 'no-evidence'
  if (capturedCount > 0) {
    status = totalQuestions > 0 && capturedCount < totalQuestions ? 'incomplete' : 'complete'
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