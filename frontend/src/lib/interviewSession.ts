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