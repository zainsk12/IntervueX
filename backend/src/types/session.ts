import type { CandidateRecord } from './candidate'
import type { FeedbackTurn } from './llm'

export type ConversationRole = 'interviewer' | 'candidate'

export interface ConversationTurn {
  role: ConversationRole
  content: string
  /** ISO 8601 timestamp of when the turn was recorded. */
  at: string
}

export type SessionStatus = 'active' | 'complete'

/**
 * Raw candidate payload as supplied by the client in a start request.
 *
 * The official contract (docs/technical-spec.md) says this follows the
 * candidate.json schema (member/missions/signals), but clients may also
 * send a minimal shape (e.g. just an id, as in the Phase A test suite).
 * This type is intentionally loose; sessionService resolves it against
 * the real dataset via the data service when possible.
 */
export interface CandidateInput {
  id?: unknown
  member?: { id?: unknown; [key: string]: unknown }
  [key: string]: unknown
}

export interface InterviewSession {
  sessionId: string
  /**
   * The full candidate record from candidates.json when the supplied id
   * matched a known candidate, otherwise the raw candidate input supplied
   * by the client (graceful fallback for unknown ids).
   */
  candidate: CandidateRecord | CandidateInput
  /** True when `candidate` was resolved from data/candidates.json. */
  candidateResolvedFromDataset: boolean
  conversationHistory: ConversationTurn[]
  questionsAsked: number
  daysCovered: Set<number>
  /** Minimal placeholder only — no evaluation/intelligence in Phase B. */
  candidateModel: Record<string, unknown>
  status: SessionStatus
  createdAt: string
  updatedAt: string
  /**
   * Final closing reply + structured feedback (Phase E), generated once —
   * the first time this session reaches `status: 'complete'` — and cached
   * here so subsequent turns on an already-complete session return the
   * same result without re-invoking the LLM.
   */
  finalFeedback?: FeedbackTurn
}
