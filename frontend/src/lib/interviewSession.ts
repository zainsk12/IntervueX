import { QUESTION_COUNT_RANGE } from '../data/interviewSetup'
import type { CandidateSetupPayload } from '../types/interview'

const STORAGE_KEY = 'intervuex.candidateSetup'

export function saveCandidateSetup(payload: CandidateSetupPayload): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // sessionStorage may be unavailable (e.g. private browsing) — non-fatal for this step.
  }
}

export function readCandidateSetup(): CandidateSetupPayload | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CandidateSetupPayload) : null
  } catch {
    return null
  }
}

/**
 * Returns the Step 41 setup payload if one exists, otherwise a sensible
 * default session so the workspace can still render (e.g. direct navigation
 * to /interview without completing Candidate Setup first).
 */
export function getCandidateSetupOrDefault(): CandidateSetupPayload {
  const existing = readCandidateSetup()
  if (existing) {
    return existing
  }

  return {
    candidate: {
      name: '',
      targetRole: '',
      experienceLevel: 'mid',
      resumeFileName: null,
    },
    context: {
      roleContext: '',
      interviewType: 'technical',
      focusAreas: ['dsa', 'backend'],
    },
    configuration: {
      difficulty: 'standard',
      depth: 'standard',
      questionCount: QUESTION_COUNT_RANGE.default,
    },
    submittedAt: new Date().toISOString(),
  }
}