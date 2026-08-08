import { QUESTION_COUNT_RANGE } from '../data/interviewSetup'
import type { CandidateSetupPayload, EvidenceLogEntry } from '../types/interview'

const STORAGE_KEY = 'intervuex.candidateSetup'
const EVIDENCE_STORAGE_KEY = 'intervuex.evidenceLog'

export function saveCandidateSetup(payload: CandidateSetupPayload): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    // A new session invalidates evidence captured under a previous candidate/setup.
    sessionStorage.removeItem(EVIDENCE_STORAGE_KEY)
  } catch {
    // sessionStorage may be unavailable (e.g. private browsing) — non-fatal for this step.
  }
}

/**
 * Persists the in-progress interview's evidence log so the Evidence System
 * (a separate route from the Interview Workspace) can read captured records
 * after the workspace unmounts.
 */
export function saveEvidenceLog(entries: EvidenceLogEntry[]): void {
  try {
    sessionStorage.setItem(EVIDENCE_STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // sessionStorage may be unavailable — evidence simply won't persist across routes.
  }
}

export function readEvidenceLog(): EvidenceLogEntry[] {
  try {
    const raw = sessionStorage.getItem(EVIDENCE_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as EvidenceLogEntry[]) : []
  } catch {
    return []
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