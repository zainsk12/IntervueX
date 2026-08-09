import { QUESTION_COUNT_RANGE } from '../data/interviewSetup'
import type { CandidateSetupPayload, EvidenceLogEntry, InterviewQuestion } from '../types/interview'
import type { InterviewFeedback } from '../types/api'

const STORAGE_KEY = 'intervuex.candidateSetup'
const EVIDENCE_STORAGE_KEY = 'intervuex.evidenceLog'
const SESSION_ID_STORAGE_KEY = 'intervuex.sessionId'
const CURRENT_QUESTION_STORAGE_KEY = 'intervuex.currentQuestion'
const FEEDBACK_STORAGE_KEY = 'intervuex.feedback'

export function saveCandidateSetup(payload: CandidateSetupPayload): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    // A new session invalidates evidence, the in-flight backend session,
    // the currently displayed question, and any prior feedback — all of
    // it belonged to the previous candidate/setup.
    sessionStorage.removeItem(EVIDENCE_STORAGE_KEY)
    sessionStorage.removeItem(SESSION_ID_STORAGE_KEY)
    sessionStorage.removeItem(CURRENT_QUESTION_STORAGE_KEY)
    sessionStorage.removeItem(FEEDBACK_STORAGE_KEY)
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

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  return `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/**
 * The backend keys interview state entirely by sessionId (in-memory, no
 * database). This returns the sessionId for the current candidate/setup,
 * creating one on first use so the frontend never re-generates it mid
 * session (which would otherwise start a brand-new backend session).
 */
export function getOrCreateSessionId(): string {
  try {
    const existing = sessionStorage.getItem(SESSION_ID_STORAGE_KEY)
    if (existing) {
      return existing
    }
    const created = generateSessionId()
    sessionStorage.setItem(SESSION_ID_STORAGE_KEY, created)
    return created
  } catch {
    return generateSessionId()
  }
}

/**
 * Persists the question currently being shown so a refresh (or navigating
 * away and back) doesn't re-call the backend's start endpoint — which
 * would append a duplicate greeting turn to an already-active session.
 */
export function saveCurrentQuestion(question: InterviewQuestion | null): void {
  try {
    if (question) {
      sessionStorage.setItem(CURRENT_QUESTION_STORAGE_KEY, JSON.stringify(question))
    } else {
      sessionStorage.removeItem(CURRENT_QUESTION_STORAGE_KEY)
    }
  } catch {
    // sessionStorage may be unavailable — resuming mid-session simply won't work.
  }
}

export function readCurrentQuestion(): InterviewQuestion | null {
  try {
    const raw = sessionStorage.getItem(CURRENT_QUESTION_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as InterviewQuestion) : null
  } catch {
    return null
  }
}

/** Persists the backend's final structured feedback once the session concludes. */
export function saveFeedback(feedback: InterviewFeedback | null): void {
  try {
    if (feedback) {
      sessionStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(feedback))
    } else {
      sessionStorage.removeItem(FEEDBACK_STORAGE_KEY)
    }
  } catch {
    // sessionStorage may be unavailable — the Results page simply won't have it.
  }
}

export function readFeedback(): InterviewFeedback | null {
  try {
    const raw = sessionStorage.getItem(FEEDBACK_STORAGE_KEY)
    return raw ? (JSON.parse(raw) as InterviewFeedback) : null
  } catch {
    return null
  }
}

/**
 * Maps the Candidate Setup form payload onto the loose `candidate` object
 * the backend's start request expects (types/session.ts CandidateInput).
 * No dataset id is collected by this form, so the backend will gracefully
 * fall back to this raw payload (candidateResolvedFromDataset: false)
 * rather than resolving a data/candidates.json record — exactly the
 * documented fallback behavior.
 */
export function buildCandidateInputPayload(setup: CandidateSetupPayload): Record<string, unknown> {
  return {
    name: setup.candidate.name,
    targetRole: setup.candidate.targetRole,
    experienceLevel: setup.candidate.experienceLevel,
    resumeFileName: setup.candidate.resumeFileName,
    roleContext: setup.context.roleContext,
    interviewType: setup.context.interviewType,
    focusAreas: setup.context.focusAreas,
    difficulty: setup.configuration.difficulty,
    depth: setup.configuration.depth,
    questionCount: setup.configuration.questionCount,
  }
}
